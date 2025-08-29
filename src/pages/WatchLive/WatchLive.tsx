import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LiveKitRoom,
} from '@livekit/components-react';
import '@livekit/components-styles';
import config from '@/constants/config';
import TikTokLive from '@/components/LiveTiktokUI/LiveTiktokUI';

const API_BASE = config.baseUrl;

export default function WatchLive() {
  const { sessionId = '' } = useParams();
  const nav = useNavigate();
  const [s, setS] = useState<{ token: string; hostURL: string; room: string } | null>(null);

  useEffect(() => {
    (async () => {
      const r = await fetch(`${API_BASE}/live/sessions/${sessionId}/join`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identity: `viewer_${Math.random().toString(36).slice(2, 8)}`,
          role: 'viewer', name: 'Viewer'
        }),
      });
      if (!r.ok) return alert('Join failed');
      const data = await r.json();
      setS({ token: data.token, hostURL: data.host_url, room: data.room });
    })();
  }, [sessionId]);

  if (!s) return <div style={{ padding: 24 }}>Joining…</div>;

  return (
    <LiveKitRoom
      token={s.token}
      serverUrl={s.hostURL}
      connect
      video={false}
      audio
      style={{ height: '100vh' }}
      data-lk-theme="default"
      onDisconnected={() => nav('/')}
    >
      <TikTokLive onClose={() => nav('/')} />
    </LiveKitRoom>
  );
}
