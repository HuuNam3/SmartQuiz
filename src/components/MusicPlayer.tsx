'use client'

import { useEffect, useRef } from 'react'

type MusicPlayerProps = {
    name: string        // tên file nhạc (không cần .mp3)
    loop?: boolean      // có lặp lại không
    volume?: number     // optional: âm lượng 0 -> 1
}

export default function MusicPlayer({
    name,
    loop = false,
    volume = 0.5,
}: MusicPlayerProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        if (!name) return

        const audio = audioRef.current

        if (audio) {
            audio.src = `/${name}.mp3`
            audio.loop = loop
            audio.volume = volume

            audio
                .play()
                .catch(() => {
                    // tránh lỗi autoplay bị chặn
                    console.log('User chưa tương tác, không autoplay được')
                })
        }
    }, [name, loop, volume])

    return <audio ref={audioRef} />
}