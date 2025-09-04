import {
  EXCLUDE_IOT_EMAILS_PATTERN,
  EXCLUDE_ZU_EMAILS_PATTERN,
  EXCLUDE_STRINGS_PATTERN,
  EXCLUDE_IOT_PATTERN
} from '../utils/exclusion';
import { API_BASE_URL, ACCOUNT, EDITOR_URL } from './api/apiConfig';
import { TableItem } from '../types';
import * as api from './api';

const TicketService = {
  getTicketAddress: async (ticketId: string) => {
    try {
      const ticket = await api.getTicketByTicketId(ticketId);
      if (!ticket?.source_id?.UUID) return 'No Address';
      const source = await api.getSourceBySourceId(ticket.source_id.UUID);
      return source?.address ?? 'No Address';
    } catch {
      return 'Get Address failed.';
    }
  },
  getTicketModel: async (ticketId: string) => {
    try {
      const modelId = (await api.getTicketByTicketId(ticketId))?.model_id?.UUID;
      if (!modelId) return 'No Ticket';
      const model = await api.getModelByModelId(modelId);
      return model || 'No Model';
    } catch {
      return 'Get Model failed.';
    }
  },
  getTicketQa: async (limit: number, isIot: boolean) => {
    try {
      const ticketsFromApi = await api.getAllTickets();
      if (!ticketsFromApi.length) return { data: [], message: 'No data' };

      const currentTime = Date.now();
      const allBaseTableItems: TableItem[] = [];

      for (const { Ticket, Producer, Owner, ProductionInfo } of ticketsFromApi) {
        const iteration = Ticket.iterations?.[0];
        const email = Producer.email;
        const listTag = Ticket.tags?.map((tag: any) => tag.value) || [];

        if (
          !iteration ||
          (!isIot && EXCLUDE_IOT_EMAILS_PATTERN.test(email)) ||
          !shouldProcessIteration(iteration, Owner, email, listTag)
        ) {
          continue;
        }

        allBaseTableItems.push(createTableItem(Ticket, email, currentTime, ProductionInfo));
      }

      if (!allBaseTableItems.length) return { data: [], message: 'No data' };

      const sortedBaseTableItems = limit
        ? allBaseTableItems.sort((a, b) => a.timeLeft - b.timeLeft).slice(0, limit)
        : allBaseTableItems.sort((a, b) => a.timeLeft - b.timeLeft);

      const processedResults = await Promise.all(
        sortedBaseTableItems.map((baseItem) => getTicketInfoByIterId(baseItem, isIot))
      );
      const filteredTickets = processedResults.filter((item): item is TableItem => item !== null);

      return filteredTickets.length
        ? { data: filteredTickets, message: '' }
        : { data: [], message: 'No data' };
    } catch (error) {
      console.error("Error in getTicketQa:", error);
      return { data: [], message: 'Get data failed.' }
    }
  },
  takeTicketQa: async (id: string) => {
    try {
      await api.updateTicket(id);
      return { status: 200, message: 'Take oki.' }
    } catch (error) {
      return { status: 500, message: 'Take failed.' }
    }
  },
  getTicketSourceKey: async (sourceId: string) => {
    try {
      const sourceKey = await api.getSourcekeyBySourceId(sourceId);
      if (!Array.isArray(sourceKey) || sourceKey.length === 0) return '';

      const rasterList = sourceKey.filter((item: any) => item.source_type === "raster");
      if (rasterList.length === 0) return '';

      return rasterList.map((rasterData: any) =>
        `${API_BASE_URL}/source/${sourceId}/sourcekey/${rasterData.id}?api_key=${ACCOUNT}`
      );
    } catch (error) {
      return 'Get Image failed.';
    }
  },
};

// Modified function to fetch info AND process the item
const getTicketInfoByIterId = async (baseItem: TableItem, isIotGlobalFlag: boolean): Promise<TableItem | null> => {
  try {
    const ticket = await api.getTicketByTicketId(baseItem.ticketId);
    if (!ticket || ticket.length === 0) return null;

    const iterationData = ticket.iterations?.[0];
    if (!iterationData) return null;

    // Extract customer and production info
    const fetchedCustomerInfo = iterationData.metadata?.customer_info?.text ?? '';
    const iterationId = iterationData.iteration_id ?? '';

    let fetchedProductionInfo = '';
    const productionStr = iterationData.metadata?.production_info?.text;
    if (productionStr) {
      try {
        const production = JSON.parse(productionStr);
        fetchedProductionInfo = Array.isArray(production)
          ? production.map((p: any) => p.msg).join('\r\n')
          : productionStr;
      } catch {
        fetchedProductionInfo = productionStr;
      }
    }

    // Normalize for exclusion checks
    const regex = /[\s,]+/g;
    const normalizedProductionInfo = fetchedProductionInfo.replace(regex, "");
    const normalizedCustomerInfo = fetchedCustomerInfo.replace(regex, "");

    if (
      EXCLUDE_STRINGS_PATTERN.test(normalizedProductionInfo) ||
      (!isIotGlobalFlag && EXCLUDE_IOT_PATTERN.test(normalizedProductionInfo))
    ) {
      return null;
    }

    // Fetch SVG if not excluded
    const fetchedSvg = ticket.model_id?.UUID
      ? (await api.getModelByModelId(ticket.model_id.UUID)) || ''
      : '';

    // Build TableItem
    const isQc = /qc/i.test(normalizedProductionInfo);
    const is3d = /#3d/i.test(normalizedCustomerInfo);
    const className =
      'space' +
      (isQc ? ' isQc' : '') +
      (is3d ? ' is3d' : '');

    return {
      ...baseItem,
      sourceId: ticket.source_id?.UUID ?? '',
      picture: fetchedSvg,
      customerInfo: fetchedCustomerInfo,
      productionInfo: fetchedProductionInfo,
      takeId: iterationId,
      isQc,
      is3d,
      className,
    };
  } catch (error) {
    console.error(`Error processing ticket info for ${baseItem.ticketId}:`, error);
    return null;
  }
};

const shouldProcessIteration = (
  iteration: any,
  Owner: any,
  email: string,
  listTag: string[]
) => {
  // Defensive checks for nested properties
  const processState = iteration?.Events?.[0]?.process_state;
  const iterationType = iteration?.iteration_type;
  const ownerName = Owner?.user_name;

  return (
    processState === 'waiting QA' &&
    iterationType === 'new' &&
    ownerName !== 'Training Production Tier 3' &&
    !email.includes('.sharework@gmail.com') &&
    !email.includes('training') &&
    !email.includes('@bpo') &&
    !EXCLUDE_ZU_EMAILS_PATTERN.test(email) &&
    !listTag.includes('t1')
  );
};

const priorityMap: Record<string, number> = {
  'regular': 48,
  'fast': 24,
  'ultrafast-16': 16,
  'ultrafast-12': 12,
  'ultrafast': 6
};

const createTableItem = (
  Ticket: any,
  email: string,
  currentTime: number,
  ProductionInfo: any
): TableItem => {
  const priorityHours = priorityMap[Ticket.priority] ?? 0;
  const createdAt = new Date(Ticket.created_at);
  const timeLeftMs = createdAt.getTime() + priorityHours * 3600000 - currentTime;
  const hoursLeft = Math.max(0, Math.floor(timeLeftMs / 3600000));
  const minsLeft = Math.max(0, Math.floor((timeLeftMs % 3600000) / 60000));

  const remain = `${hoursLeft.toString().padStart(2, '0')}:${minsLeft.toString().padStart(2, '0')}`;
  const type = `${priorityHours}h`;

  return {
    ticketId: Ticket.id,
    sourceId: '',
    type,
    remain,
    isQc: false,
    is3d: false,
    className: '',
    customerInfo: '',
    productionInfo: '',
    takeId: Ticket.iterations?.[0]?.iteration_id ?? '',
    email,
    picture: '',
    timeLeft: timeLeftMs,
    floorCount: ProductionInfo?.floor_count?.Int32 ?? 0,
    url: `${EDITOR_URL}?config=fl${Ticket.conversion_type}&ticket_id=${Ticket.id}&loc=en`,
  };
};

export { TicketService };