"use server"
import path, { resolve } from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import cloudinary from 'cloudinary';
import { revalidatePath } from 'next/cache';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

async function saveVideoslocal(formData){
    const files = FormData.getAll('files');
    const multipleBuffersPromise=files.map(file=>(
     file.arrayBuffer().then(data=>{
         const buffer =Buffer.from(data);
         const name=uuidv4();
         const ext=file.type.split('/')[1];
         // const uploadDir=path.join(process.cwd(),'public',`/${name}.${ext}`);
         //doesn't work in vercel serverless
         const tempDir = os.tmpdir();
         const uploadDir = path.join(tempDir,`/${name}.${ext}`);//works in vercel serverless
         console.log(tempDir);
        
         fs.writeFile(uploadDir,buffer);
         return {filePath:uploadDir,fileName: file.name};
     })
    ))
    return await Promise.all(multipleBuffersPromise);
}

async function uploadVideoToCloudinary(newFiles){
    const multipleUploadPromise = newFiles.map(file => (
        cloudinary.v2.uploader.upload(file.filePath, {
            folder: 'nextjs-server-actions',
        })
        ))
        return await Promise.all(multipleUploadPromise);
    }
const delay =(delayInms)=>{
    return new Promise(resolve=>setTimeout(resolve,delayInms));
}
export async function uploadVideo(formData) {
    try {
        const newFiles= await saveVideoslocal(formData);
        const videos =await uploadVideoToCloudinary(newFiles);
        console.log(videos);
        newFiles.map(file => fs.unlink(file.filePath));
        await delay(2000);
        revalidatePath('/');
        return {msg: 'Upload successfully'}
    } catch (error) {
        return {errms: error.message}
    }
}