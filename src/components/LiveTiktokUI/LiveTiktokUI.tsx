// src/components/TikTokLive.tsx
import { useEffect, useMemo, useState } from 'react';
import { ParticipantTile, RoomAudioRenderer, useRoomContext, useTracks } from '@livekit/components-react';
import { RoomEvent, Track } from 'livekit-client';
import UnmuteGate from '../UnmuteGate/UnmuteGate';

type ChatMsg = { id: string; user: string; text: string; ts: number };

export default function TikTokLive({
    displayName, avatarUrl, onClose,
}: { displayName?: string; avatarUrl?: string; onClose?: () => void }) {
    const room = useRoomContext();

    const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }], {
        onlySubscribed: false,
    });

    const mainTrack = useMemo(() =>
        tracks.find(t => t.publication?.isSubscribed) ?? tracks[0], [tracks]);

    const [viewerCount, setViewerCount] = useState<number>(1 + room.numParticipants);
    useEffect(() => {
        const update = () => setViewerCount(1 + room.numParticipants);
        update();
        room.on(RoomEvent.ParticipantConnected, update);
        room.on(RoomEvent.ParticipantDisconnected, update);
        return () => {
            room.off(RoomEvent.ParticipantConnected, update);
            room.off(RoomEvent.ParticipantDisconnected, update);
        };
    }, [room]);

    const [chat, setChat] = useState<ChatMsg[]>([]);
    const [text, setText] = useState('');
    const encoder = useMemo(() => new TextEncoder(), []);
    const decoder = useMemo(() => new TextDecoder(), []);

    useEffect(() => {
        const onData = (payload: Uint8Array, _participant?: any, _kind?: any, topic?: string) => {
            if (topic !== 'chat') return;
            try {
                const m = JSON.parse(decoder.decode(payload));
                setChat(prev => [...prev.slice(-49), m]);
            } catch { }
        };
        room.on(RoomEvent.DataReceived, onData);
        return () => { room.off(RoomEvent.DataReceived, onData); };
    }, [room, decoder]);

    async function sendChat() {
        const t = text.trim();
        if (!t) return;
        const me = room.localParticipant?.identity ?? 'me';
        const msg: ChatMsg = { id: `${Date.now()}-${Math.random()}`, user: me, text: t, ts: Date.now() };
        setChat(prev => [...prev.slice(-49), msg]);
        setText('');
        try {
            await room.localParticipant.publishData(encoder.encode(JSON.stringify(msg)), {
                reliable: true, topic: 'chat',
            });
        } catch (e) { console.error('publish chat failed', e); }
    }

    type Heart = { id: string; x: number };
    const [hearts, setHearts] = useState<Heart[]>([]);
    const spawnHeart = (count = 1) => {
        setHearts(prev => [
            ...prev,
            ...Array.from({ length: count }).map(() => ({ id: Math.random().toString(36).slice(2), x: 10 + Math.random() * 40 })),
        ]);
        setTimeout(() => setHearts(prev => prev.slice(count)), 2800);
    };
    useEffect(() => {
        const onData = (_payload: Uint8Array, _p?: any, _k?: any, topic?: string) => {
            if (topic !== 'like') return;
            spawnHeart(1);
        };
        room.on(RoomEvent.DataReceived, onData);
        return () => { room.off(RoomEvent.DataReceived, onData); };
    }, [room]);

    async function sendHeart() {
        spawnHeart(1);
        try {
            await room.localParticipant.publishData(encoder.encode('❤️'), { reliable: false, topic: 'like' });
        } catch { }
    }

    const TopBar = () => (
        <div style={{
            position: 'absolute', top: 12, left: 12, right: 12, display: 'flex',
            justifyContent: 'space-between', alignItems: 'center', color: '#fff', zIndex: 5,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img src={avatarUrl ?? 'https://picsum.photos/seed/host/64'} width={32} height={32} style={{ borderRadius: '50%' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <b>{displayName ?? room.name ?? '@host'}</b>
                    <span style={{ fontSize: 12, background: '#e91e63', padding: '2px 6px', borderRadius: 4 }}>LIVE</span>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span>👁 {viewerCount}</span>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
        </div>
    );

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000' }}>
            <div style={{ position: 'absolute', inset: 0 }}>
                {mainTrack && <ParticipantTile trackRef={mainTrack} style={{ width: '100%', height: '100%' }} />}
            </div>

            <RoomAudioRenderer />
            <UnmuteGate />
            <TopBar />

            <div style={{
                position: 'absolute', left: 12, right: 84, bottom: 88, color: '#fff',
                display: 'flex', flexDirection: 'column', gap: 6, pointerEvents: 'none'
            }}>
                {chat.slice(-6).map(m => (
                    <div key={m.id} style={{
                        background: 'rgba(0,0,0,.35)', padding: '6px 10px', borderRadius: 14,
                        width: 'fit-content', maxWidth: '100%', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                    }}>
                        <b style={{ opacity: .85 }}>{m.user}:</b> {m.text}
                    </div>
                ))}
            </div>

            <div style={{
                position: 'absolute', left: 12, right: 12, bottom: 16, display: 'flex',
                alignItems: 'center', gap: 10, zIndex: 5
            }}>
                <input
                    value={text}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' ? sendChat() : undefined}
                    placeholder="Comment"
                    style={{ flex: 1, borderRadius: 24, padding: '10px 14px', border: 'none' }}
                />
                <button onClick={sendChat} style={{ borderRadius: 20, padding: '10px 14px' }}>Send</button>
                <button onClick={sendHeart} style={{ borderRadius: '50%', width: 44, height: 44, fontSize: 18 }}>❤</button>
            </div>

            <div style={{ position: 'absolute', right: 16, bottom: 100, width: 80, height: 280, pointerEvents: 'none' }}>
                <style>
                    {`
                        @keyframes floatUp {
                            0% { transform: translateY(0) scale(0.9); opacity: 0; }
                            10% { opacity: 1; }
                            100% { transform: translateY(-260px) scale(1.3); opacity: 0; }
                        }`
                    }
                </style>
                {hearts.map(h => (
                    <div key={h.id}
                        style={{
                            position: 'absolute', bottom: 0, left: `${h.x}%`, transform: 'translateX(-50%)',
                            animation: 'floatUp 2.8s ease-out forwards', fontSize: 22,
                        }}>
                        ❤️
                    </div>
                ))}
            </div>
        </div>
    );
}
