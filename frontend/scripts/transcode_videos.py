from pathlib import Path
import subprocess
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
VIDEOS_DIR = ROOT / "public" / "videos"

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

video_files = [
    file_path
    for file_path in sorted(VIDEOS_DIR.glob("*.mp4"))
    if "_web" not in file_path.stem and "_backup_original" not in file_path.stem
]
if not video_files:
    print("No se encontraron videos en:", VIDEOS_DIR)
    raise SystemExit(0)

print("FFmpeg:", ffmpeg)
for source in video_files:
    temp_output = source.with_name(source.stem + "_web.mp4")
    cmd = [
        ffmpeg,
        "-y",
        "-i",
        str(source),
        "-map", "0:v:0",
        "-map", "0:a?",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "23",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        "-c:a", "aac",
        "-b:a", "128k",
        str(temp_output),
    ]

    print(f"\nConvirtiendo: {source.name}")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print("Error convirtiendo", source.name)
        print(result.stderr[-1200:])
        continue

    print(f"OK: {temp_output.name}")

print("\nProceso terminado.")
