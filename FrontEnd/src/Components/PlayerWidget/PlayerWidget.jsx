import React, { useEffect, useRef, useState } from "react";
import "./player-widget.css";
import { msToMinutesSeconds, fetchSpotifyRequestMock } from "../../utils";
import { mockCurrentlyPlaying } from "../../spotifyMockResponses";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Slider from "@mui/material/Slider";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import CloseIcon from "@mui/icons-material/Close";

const PlayerWidget = (props) => {
  const { username, owner } = props;

  const [itemTrack, setItemTrack] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [showWidget, setShowWidget] = useState(true);

  const volumeDebounceTimeout = useRef(null);
  const seekDebounceTimeout = useRef(null);
  // const token = "YOUR_ACCESS_TOKEN";

  const updateTrackState = (response) => {
    setItemTrack(response.item);
    setProgress(response.progress_ms);
    setDuration(response.item.duration_ms);
    setIsPlaying(response.is_playing);
    setLastUpdate(Date.now());
  };

  useEffect(() => {
    const fetchSpoti = async () => {
      // try {
      //   const response = await spotifyApiRequest({
      //     endpoint: "/me/player/currently-playing",
      //     method: "GET",
      //     token,
      //   });
      //   updateTrackState(response);
      // } catch (e) {
      //   setItemTrack(null);
      //   setProgress(0);
      //   setDuration(0);
      //   setIsPlaying(false);
      // }

      // mock
      const response = await fetchSpotifyRequestMock(mockCurrentlyPlaying);
      updateTrackState(response);
    };
    fetchSpoti();
  }, []);

  useEffect(() => {
    let interval = null;
    if (isPlaying && progress < duration) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev + 1000 >= duration) {
            clearInterval(interval);
            return duration;
          }
          return prev + 1000;
        });
        setLastUpdate(Date.now());
      }, 1000);
    }
    if (isPlaying && progress >= duration) {
      handleNext();
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, duration]);

  const handlePlayPause = async () => {
    // if (isPlaying) {
    //   await spotifyApiRequest({
    //     endpoint: "/me/player/pause",
    //     method: "PUT",
    //     token,
    //   });
    // } else {
    //   await spotifyApiRequest({
    //     endpoint: "/me/player/play",
    //     method: "PUT",
    //     token,
    //   });
    // }
    // const response = await spotifyApiRequest({
    //   endpoint: "/me/player/currently-playing",
    //   method: "GET",
    //   token,
    // });
    // updateTrackState(response);
    setIsPlaying((prev) => !prev);
  };

  const handlePrev = async () => {
    // await spotifyApiRequest({
    //   endpoint: "/me/player/previous",
    //   method: "POST",
    //   token,
    // });
    // const response = await spotifyApiRequest({
    //   endpoint: "/me/player/currently-playing",
    //   method: "GET",
    //   token,
    // });
    // updateTrackState(response);
    setProgress(0);
    console.log("Previous track played");
  };

  const handleNext = async () => {
    // await spotifyApiRequest({
    //   endpoint: "/me/player/next",
    //   method: "POST",
    //   token,
    // });
    // const response = await spotifyApiRequest({
    //   endpoint: "/me/player/currently-playing",
    //   method: "GET",
    //   token,
    // });
    // updateTrackState(response);
    setProgress(0);
    console.log("Next track played");
  };

  const handleVolumeIconClick = async () => {
    // await spotifyApiRequest({
    //   endpoint: "/me/player/volume",
    //   method: "PUT",
    //   params: { volume_percent: volume === 0 ? (prevVolume > 0 ? prevVolume : 50) : 0 },
    //   token,
    // });
    // const response = await spotifyApiRequest({
    //   endpoint: "/me/player/currently-playing",
    //   method: "GET",
    //   token,
    // });
    // updateTrackState(response);
    if (volume === 0) {
      setVolume(prevVolume > 0 ? prevVolume : 50);
    } else {
      setPrevVolume(volume);
      setVolume(0);
    }
  };

  const handleVolumeSliderChange = (event, value) => {
    setVolume(value);
    if (volumeDebounceTimeout.current) {
      clearTimeout(volumeDebounceTimeout.current);
    }
    volumeDebounceTimeout.current = setTimeout(() => {
      // await spotifyApiRequest({
      //   endpoint: "/me/player/volume",
      //   method: "PUT",
      //   params: { volume_percent: value },
      //   token,
      // });
      // const response = await spotifyApiRequest({
      //   endpoint: "/me/player/currently-playing",
      //   method: "GET",
      //   token,
      // });
      // updateTrackState(response);
      console.log("Volume set to", value);
    }, 300);
  };

  const handleProgressSliderChange = (event, value) => {
    setProgress(value);
    if (seekDebounceTimeout.current) {
      clearTimeout(seekDebounceTimeout.current);
    }
    seekDebounceTimeout.current = setTimeout(() => {
      // await spotifyApiRequest({
      //   endpoint: "/me/player/seek",
      //   method: "PUT",
      //   params: { position_ms: value },
      //   token,
      // });
      // const response = await spotifyApiRequest({
      //   endpoint: "/me/player/currently-playing",
      //   method: "GET",
      //   token,
      // });
      // updateTrackState(response);
      console.log("Seek to position", value);
    }, 300);
  };

  const isOwner = username === owner;

  return (
    <React.Fragment>
      <div
        className={`pwidget${showWidget ? "" : " pwidget--hidden"}${!isOwner ? " pwidget--locked" : ""}`}
      >
        <button
          className="pwidget__toggle-btn pwidget__toggle-btn--close"
          onClick={() => setShowWidget(false)}
          aria-label="Hide player"
          title="Hide player"
        >
          <CloseIcon fontSize="small" />
        </button>
        <div className="pwidget__info">
          <img
            className="pwidget__cover"
            src={itemTrack?.album?.images[0]?.url}
            alt={itemTrack?.album?.name}
          />
          <div className="pwidget__meta">
            <p className="pwidget__title">{itemTrack?.name}</p>
            <p className="pwidget__artist">
              {itemTrack?.artists?.map((artist) => artist.name).join(", ")}
            </p>
          </div>
        </div>
        <div className="pwidget__ctrls">
          <div className="pwidget__btns">
            <button
              className="pwidget__btn"
              onClick={isOwner ? handlePrev : undefined}
              disabled={!isOwner}
            >
              <SkipPreviousIcon fontSize="small" style={{ color: "#FFF5E9" }} />
            </button>
            <button
              className="pwidget__btn pwidget__btn--main"
              onClick={isOwner ? handlePlayPause : undefined}
              disabled={!isOwner}
            >
              {isPlaying ? (
                <PauseIcon fontSize="medium" style={{ color: "#231f20" }} />
              ) : (
                <PlayArrowIcon fontSize="medium" style={{ color: "#231f20" }} />
              )}
            </button>
            <button
              className="pwidget__btn"
              onClick={isOwner ? handleNext : undefined}
              disabled={!isOwner}
            >
              <SkipNextIcon fontSize="small" style={{ color: "#FFF5E9" }} />
            </button>
          </div>
          <div className="pwidget__prog">
            <span className="pwidget__blndtxt">
              {msToMinutesSeconds(progress)}
            </span>
            <Slider
              className="pwidget__prog-slider"
              min={0}
              max={duration}
              value={progress}
              onChange={isOwner ? handleProgressSliderChange : undefined}
              onChangeCommitted={
                isOwner ? handleProgressSliderChange : undefined
              }
              aria-label="Track progress"
              disabled={!isOwner}
            />
            <span className="pwidget__blndtxt">
              -{msToMinutesSeconds(Math.max(duration - progress, 0))}
            </span>
          </div>
          <span className="pwidget__dj">DJ {owner || "Unknown"}</span>
        </div>
        <div className="pwidget__vol">
          <span
            className="pwidget__vol-icon"
            onClick={isOwner ? handleVolumeIconClick : undefined}
            style={!isOwner ? { cursor: "not-allowed", opacity: 0.5 } : {}}
          >
            {volume === 0 ? (
              <VolumeOffIcon fontSize="small" style={{ color: "#FFF5E9" }} />
            ) : volume > 0 && volume <= 20 ? (
              <VolumeMuteIcon fontSize="small" style={{ color: "#FFF5E9" }} />
            ) : volume > 20 && volume < 70 ? (
              <VolumeDownIcon fontSize="small" style={{ color: "#FFF5E9" }} />
            ) : (
              <VolumeUpIcon fontSize="small" style={{ color: "#FFF5E9" }} />
            )}
          </span>
          <Slider
            className="pwidget__vol-slider"
            min={0}
            max={100}
            value={volume}
            onChange={isOwner ? handleVolumeSliderChange : undefined}
            aria-label="Volume"
            disabled={!isOwner}
          />
        </div>
      </div>
      {!showWidget && (
        <button
          className="pwidget__toggle-btn"
          onClick={() => setShowWidget(true)}
          aria-label="Show player"
        >
          <span
            className={`pwidget__toggle-btn-icon${isPlaying ? " pwidget__toggle-btn-icon--glow" : ""}`}
          >
            <MusicNoteIcon fontSize="medium" />
          </span>
        </button>
      )}
    </React.Fragment>
  );
};

export default PlayerWidget;
