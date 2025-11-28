import HomePage from './pages/HomePage';
import SwapPage from './pages/SwapPage';
import PoolsPage from './pages/PoolsPage';
import LiquidityPage from './pages/LiquidityPage';
import PositionsPage from './pages/PositionsPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
  },
  {
    name: 'Swap',
    path: '/swap',
    element: <SwapPage />,
  },
  {
    name: 'Pools',
    path: '/pools',
    element: <PoolsPage />,
  },
  {
    name: 'Liquidity',
    path: '/liquidity',
    element: <LiquidityPage />,
  },
  {
    name: 'Positions',
    path: '/positions',
    element: <PositionsPage />,
  },
];

export default routes;
