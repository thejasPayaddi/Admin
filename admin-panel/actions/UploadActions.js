"use server"
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import cloudinary from 'cloudinary';
import { revalidatePath } from 'next/cache';
import Photo from '@/models/PhotoModel';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})
async function savePhotosLocal(FormData){
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
        // console.log(tempDir);
       
        fs.writeFile(uploadDir,buffer);
        return {filePath:uploadDir,fileName: file.name};
    })
   ))
   return await Promise.all(multipleBuffersPromise);
}

async function uploadPhotosToCloudinary(newFiles,folder){
    const multipleUploadPromise = newFiles.map(file => (
        cloudinary.v2.uploader.upload(file.filePath, {
            folder: folder,
        })
        ))
        return await Promise.all(multipleUploadPromise);
    }
    const delay =(delayInms)=>{
        return new Promise(resolve=>setTimeout(resolve,delayInms));
    }

export async function uploadPhoto(formData,folder) {
    try {
        const newFiles= await savePhotosLocal(formData);
        const photos =await uploadPhotosToCloudinary(newFiles,folder);
        // console.log(photos);
        newFiles.map(file => fs.unlink(file.filePath));
        const newPhotos = photos.map(photo=>{
            const newPhoto = new Photo({
                public_id: photo.public_id,
                secure_url: photo.secure_url,
            })
            return newPhoto.save();
        })
        // console.log(newPhotos);

        await delay(1000);
        revalidatePath('/');
        return {msg: 'Upload successfully'}
    } catch (error) {
        return {errms: error.message}
    }
}
// export async function getAllPhotos(formData) {
//     try {
//         const {resources} =await cloudinary.v2.search.expression('folder:nextjs-server-actions/*').sort_by('created_at','desc').max_results(500).execute();
//         // const resources = await Photo.find().sort({createdAt: 'desc'}).limit(500);

//         return resources;
//     } catch (error) {
//         return {errms: error.message}
//     }
// }
export async function getAllPhotos(folder) {
    try {
        const expression = folder ? `folder:${folder}/*` : 'folder:nextjs-server-actions/*';
        const { resources } = await cloudinary.v2.search.expression(expression).sort_by('created_at', 'desc').max_results(500).execute();
        return resources;
    } catch (error) {
        return { errms: error.message };
    }
}
export async function deletePhoto(public_id) {
    try {
        const res = await cloudinary.v2.uploader.destroy(public_id);
        const photo = await Photo.findOneAndDelete({public_id});
        revalidatePath('/');
        return {msg: 'Delete successfully'}
    } catch (error) {
        return {errms: error.message}
    }
}

export async function revalidate(path){
    revalidatePath(path);
}

// async function uploadPhotosToHome(newFiles){
//     const multipleUploadPromise = newFiles.map(file => (
//         cloudinary.v2.uploader.upload(file.filePath, {
//             folder: 'Home-Photos',
//         })
//         ))
//         return await Promise.all(multipleUploadPromise);
//     }

// export async function uploadPhotoHome(formData) {
//     try {
//         const newFiles= await savePhotosLocal(formData);
//         const photos =await uploadPhotosToHome(newFiles);
//         console.log(photos);
//         newFiles.map(file => fs.unlink(file.filePath));
//         revalidatePath('/');
//         return {msg: 'Upload successfully'}
//     } catch (error) {
//         return {errms: error.message}
//     }
// }

// async function uploadPhotosToHomeBestActivitiesToTry(newFiles){
//     const multipleUploadPromise = newFiles.map(file => (
//         cloudinary.v2.uploader.upload(file.filePath, {
//             folder: 'Home-Photos/BestActivitiesToTry',
//         })
//         ))
//         return await Promise.all(multipleUploadPromise);
//     }

// export async function uploadPhotoHomeBestActivity(formData) {
//     try {
//         const newFiles= await savePhotosLocal(formData);
//         const photos =await uploadPhotosToHomeBestActivitiesToTry(newFiles);
//         console.log(photos);
//         newFiles.map(file => fs.unlink(file.filePath));
//         revalidatePath('/');
//         return {msg: 'Upload successfully'}
//     } catch (error) {
//         return {errms: error.message}
//     }
// }


// async function uploadPhotosToHomeDestinations(newFiles){
//     const multipleUploadPromise = newFiles.map(file => (
//         cloudinary.v2.uploader.upload(file.filePath, {
//             folder: 'Home-Photos/Destinations',
//         })
//         ))
//         return await Promise.all(multipleUploadPromise);
//     }

// export async function uploadPhotoHomeDestination(formData) {
//     try {
//         const newFiles= await savePhotosLocal(formData);
//         const photos =await uploadPhotosToHomeDestinations(newFiles);
//         console.log(photos);
//         newFiles.map(file => fs.unlink(file.filePath));
//         revalidatePath('/');
//         return {msg: 'Upload successfully'}
//     } catch (error) {
//         return {errms: error.message}
//     }
// }

// async function uploadPhotosToHomeFerries(newFiles){
//     const multipleUploadPromise = newFiles.map(file => (
//         cloudinary.v2.uploader.upload(file.filePath, {
//             folder: 'Home-Photos/Ferries',
//         })
//         ))
//         return await Promise.all(multipleUploadPromise);
//     }

// export async function uploadPhotoHomeFerry(formData) {
//     try {
//         const newFiles= await savePhotosLocal(formData);
//         const photos =await uploadPhotosToHomeFerries(newFiles);
//         console.log(photos);
//         newFiles.map(file => fs.unlink(file.filePath));
//         revalidatePath('/');
//         return {msg: 'Upload successfully'}
//     } catch (error) {
//         return {errms: error.message}
//     }
// }

// async function uploadPhotosToHomeSightSeeings(newFiles){
//     const multipleUploadPromise = newFiles.map(file => (
//         cloudinary.v2.uploader.upload(file.filePath, {
//             folder: 'Home-Photos/SightSeeings',
//         })
//         ))
//         return await Promise.all(multipleUploadPromise);
//     }

// export async function uploadPhotoHomeSightSeeing(formData) {
//     try {
//         const newFiles= await savePhotosLocal(formData);
//         const photos =await uploadPhotosToHomeSightSeeings(newFiles);
//         console.log(photos);
//         newFiles.map(file => fs.unlink(file.filePath));
//         revalidatePath('/');
//         return {msg: 'Upload successfully'}
//     } catch (error) {
//         return {errms: error.message}
//     }
// }

// async function uploadPhotosToHomeTopBeaches(newFiles){
//     const multipleUploadPromise = newFiles.map(file => (
//         cloudinary.v2.uploader.upload(file.filePath, {
//             folder: 'Home-Photos/TopBeaches',
//         })
//         ))
//         return await Promise.all(multipleUploadPromise);
//     }

// export async function uploadPhotoHomeTopBeach(formData) {
//     try {
//         const newFiles= await savePhotosLocal(formData);
//         const photos =await uploadPhotosToHomeTopBeaches(newFiles);
//         console.log(photos);
//         newFiles.map(file => fs.unlink(file.filePath));
//         revalidatePath('/');
//         return {msg: 'Upload successfully'}
//     } catch (error) {
//         return {errms: error.message}
//     }
// }

// async function uploadPhotosToHomeTopSellingPackages(newFiles){
//     const multipleUploadPromise = newFiles.map(file => (
//         cloudinary.v2.uploader.upload(file.filePath, {
//             folder: 'Home-Photos/TopSellingPackages',
//         })
//         ))
//         return await Promise.all(multipleUploadPromise);
//     }

// export async function uploadPhotoHomeTopSellingPackage(formData) {
//     try {
//         const newFiles= await savePhotosLocal(formData);
//         const photos =await uploadPhotosToHomeTopSellingPackages(newFiles);
//         console.log(photos);
//         newFiles.map(file => fs.unlink(file.filePath));
//         revalidatePath('/');
//         return {msg: 'Upload successfully'}
//     } catch (error) {
//         return {errms: error.message}
//     }
// }




