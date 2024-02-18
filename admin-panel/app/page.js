import { getAllPhotos } from '@/actions/UploadActions'
import PhotoList from '@/components/PhotoList';
import UploadForm from '@/components/UploadForm'
import React from 'react'

const Home = async () => {
  // const photos= await getAllPhotos();
  // Get all photos from default folder
const allPhotos = await getAllPhotos();

// Get all photos from a specific folder
const photos = await getAllPhotos('Home-photos');

  // console.log(photos)
  return (
    <div>
      <h1>Nextjs Server Actions Upload image files</h1>
      <UploadForm />
      <h1>Photos</h1>
      <PhotoList photos={photos || []}/>
    </div>
  )
}

export default Home