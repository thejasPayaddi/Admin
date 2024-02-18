import { getAllPhotos } from '@/actions/UploadActions'
import PhotoList from '@/components/PhotoList';
import UploadForm from '@/components/UploadForm'
import folders from '@/components/folder';
import React from 'react'

const Home = async () => {
  // const photos= await getAllPhotos();
  // Get all photos from default folder
const allPhotos = await getAllPhotos();

// Get all photos from a specific folder
const photos = await getAllPhotos(folders.HomephotosBestActivityToTryVideos);

  // console.log(photos)
  return (
    <div>
      <h1>Beyond Oceans website</h1>
      <UploadForm folder={folders.HomephotosBestActivityToTryVideos} />
      <h1>Photos</h1>
      <PhotoList photos={photos || []}/>
    </div>
  )
}

export default Home