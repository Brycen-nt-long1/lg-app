'use client'

import { notification } from 'antd';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

const Notification = (type: NotificationType, mess: string) => {
  notification[type]({
    message: capitalizeFirstLetter(type),
    description: mess,
  });
};

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export { Notification };