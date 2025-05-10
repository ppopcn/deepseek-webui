'use client';

import { useEffect, useState } from 'react';
import { Card, Statistic, Tooltip } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import { useSettingsStore } from '@/lib/store/settings-store';
import { getBalance, BalanceResponse } from '@/lib/api/deepseek';
import styles from '@/styles/layout/balance-display.module.css';

export const BalanceDisplay = () => {
  const { apiKey } = useSettingsStore();
  const [balance, setBalance] = useState<BalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    if (!apiKey) {
      setBalance(null);
      return;
    }
    
    try {
      setLoading(true);
      const data = await getBalance(apiKey);
      setBalance(data);
    } catch (error) {
      console.error('获取余额失败:', error);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [apiKey]);

  useEffect(() => {
    if (!apiKey) return;
    
    const interval = setInterval(fetchBalance, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [apiKey]);

  if (!balance || !balance.is_available) return null;

  const cnyBalance = balance.balance_infos.find(info => info.currency === 'CNY');
  if (!cnyBalance) return null;

  return (
    <div className={styles.container}>
      <Card loading={loading} bordered={false} size="small" className={styles.card}>
        <Tooltip
          title={
            <>
              <div>赠金余额: ¥{cnyBalance.granted_balance}</div>
              <div>充值余额: ¥{cnyBalance.topped_up_balance}</div>
            </>
          }
        >
          <Statistic
            title="账户余额"
            value={cnyBalance.total_balance}
            prefix={<WalletOutlined />}
            suffix="¥"
            precision={2}
            valueRender={(node) => (
              <a 
                href="https://platform.deepseek.com/usage" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                {node}
              </a>
            )}
          />
        </Tooltip>
      </Card>
    </div>
  );
};
