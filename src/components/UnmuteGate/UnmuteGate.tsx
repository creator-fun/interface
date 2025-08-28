// src/components/UnmuteGate.tsx
import { useEffect, useState } from 'react';
import { useRoomContext } from '@livekit/components-react';

export default function UnmuteGate() {
    const room = useRoomContext();
    const [blocked, setBlocked] = useState(false);

    useEffect(() => {
        setBlocked(!room?.canPlaybackAudio);
        const onChange = () => setBlocked(!room.canPlaybackAudio);
        room?.on('audioPlaybackChanged', onChange);
        return () => {
            room?.off('audioPlaybackChanged', onChange)
        };
    }, [room]);

    if (!blocked) return null;

    return (
        <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,.45)', zIndex: 50
        }}>
            <button
                onClick={async () => { try { await room.startAudio(); setBlocked(false); } catch { } }}
                style={{ padding: '10px 14px', borderRadius: 12, fontSize: 16 }}
            >
                Enable audio
            </button>
        </div>
    );
}
