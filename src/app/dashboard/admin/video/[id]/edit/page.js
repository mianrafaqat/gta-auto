"use client";

import React from "react";
import VideoAddView from "src/sections/video/view/video-add-view";

export default function VideoEditPage({ params }) {
  return <VideoAddView isEdit videoId={params.id} />;
}
