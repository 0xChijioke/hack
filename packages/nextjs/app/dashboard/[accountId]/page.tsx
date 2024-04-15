'use client'

import { NextPage } from 'next';
import { useParams } from 'next/navigation';
import React from 'react'
import Dashboard from '../components/Dashboard';

const DashboardPage: NextPage = () => {
  const param = useParams();
  const { accountId } = param;

  return (
    <div>
      <Dashboard accountId={accountId as unknown as bigint} />
    </div>
  )
}

export default DashboardPage;