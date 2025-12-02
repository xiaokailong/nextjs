'use client';

interface MusicCardProps {
  isDark: boolean;
}

export default function MusicCard({ isDark }: MusicCardProps) {
  // 网易云音乐热门歌单
  const playlistId = '3778678'; // 云音乐热歌榜
  
  return (
    <div className="w-full h-full overflow-hidden">
      <iframe
        frameBorder={0}
        marginWidth={0}
        marginHeight={0}
        width="100%"
        height="100%"
        src={`//music.163.com/outchain/player?type=0&id=${playlistId}&auto=0&height=430`}
        loading="lazy"
        className="w-full h-full"
        style={{ border: 'none', display: 'block' }}
      />
    </div>
  );
}
