'use client';

import { Menu } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageOutlined,
  SettingOutlined,
  BookOutlined,
  FunctionOutlined,
} from '@ant-design/icons';
import styles from '@/styles/layout/nav-menu.module.css';

const menuItems = [
  {
    key: '/chat',
    icon: <MessageOutlined />,
    label: <Link href="/chat">对话</Link>,
  },

  
  {
    key: '/functions',
    icon: <SettingOutlined />,
    label: <Link href="/settings">设置</Link>,
  },
];

export function NavMenu() {
  const pathname = usePathname();
  const selectedKey = menuItems.find(item => 
    pathname.startsWith(item.key)
  )?.key || pathname;

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      items={menuItems}
      className={styles.menu}
    />
  );
} 
