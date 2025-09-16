import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LivestreamHome() {
  const [title, setTitle] = useState('My First Live');
  const [creatorId, setCreatorId] = useState('user1');
  const [sessionId, setSessionId] = useState('');
  const nav = useNavigate();

  return (
    <div style={{ padding: 24 }}>
      <h2>Demo Livestream (LiveKit Cloud)</h2>

      <h3>Host</h3>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="title" />
      <input value={creatorId} onChange={e=>setCreatorId(e.target.value)} placeholder="creator_id" />
      <button onClick={()=> nav(`/host-live?title=${encodeURIComponent(title)}&creator_id=${encodeURIComponent(creatorId)}`)}>
        Go Live
      </button>

      <h3 style={{marginTop:24}}>Viewer</h3>
      <input value={sessionId} onChange={e=>setSessionId(e.target.value)} placeholder="session_id" />
      <button onClick={()=> nav(`/watch-live/${encodeURIComponent(sessionId)}`)}>Join</button>
    </div>
  );
}
