import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

export async function Header() {
  try {
    const headerData = await getCachedGlobal('header', 1)()
    return <HeaderClient data={headerData} />
  } catch (err: any) {
    return (
      <div style={{ background: 'red', color: 'white', padding: '20px', zIndex: 9999, position: 'relative' }}>
        <h2>Header Error</h2>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{err?.message}</pre>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{err?.stack}</pre>
      </div>
    )
  }
}
