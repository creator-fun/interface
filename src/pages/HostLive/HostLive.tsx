// src/pages/HostLive.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LiveKitRoom } from '@livekit/components-react';
import '@livekit/components-styles';
import TikTokLive from '@/components/LiveTiktokUI/LiveTiktokUI';
import config from '@/constants/config';

const API_BASE = config.baseUrl;

export default function HostLive() {
    const [sp] = useSearchParams();
    const title = sp.get('title') ?? 'My Live';
    const creatorId = sp.get('creator_id') ?? 'user1';
    const nav = useNavigate();
    const [s, setS] = useState<{ id: string; room: string; hostURL: string; token: string } | null>(null);

    useEffect(() => {
        (async () => {
            const res = await fetch(`${API_BASE}/live/sessions`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, creator_id: creatorId }),
            });
            if (!res.ok) return alert('Create live failed');
            const data = await res.json();
            setS({ id: data.session_id, room: data.room, hostURL: data.host_url, token: data.host_token });
        })();
    }, [title, creatorId]);

    if (!s) return <div style={{ padding: 24 }}>Creating…</div>;

    return (
        <LiveKitRoom
            token={s.token}
            serverUrl={s.hostURL}
            connect
            video
            audio={{ echoCancellation: true, noiseSuppression: true, autoGainControl: true }}
            style={{ height: '100vh' }}
            data-lk-theme="default"
            onDisconnected={() => nav('/')}
        >
            <TikTokLive displayName={creatorId} onClose={() => nav('/')} />
        </LiveKitRoom>
    );
}
