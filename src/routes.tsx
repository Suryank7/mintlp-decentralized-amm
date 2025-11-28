import HomePage from './pages/HomePage';
import SwapPage from './pages/SwapPage';
import PoolsPage from './pages/PoolsPage';
import PoolDetailPage from './pages/PoolDetailPage';
import LiquidityPage from './pages/LiquidityPage';
import PositionsPage from './pages/PositionsPage';
import PositionDetailPage from './pages/PositionDetailPage';
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
    name: 'Pool Detail',
    path: '/pools/:id',
    element: <PoolDetailPage />,
    visible: false,
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
  {
    name: 'Position Detail',
    path: '/positions/:id',
    element: <PositionDetailPage />,
    visible: false,
  },
];

export default routes;
