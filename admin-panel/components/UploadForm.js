"use client"
import {useRef, useState} from 'react'
import PhotoCard from './PhotoCard';
import Buttonsubmit from './Buttonsubmit';
import { revalidate, uploadPhoto } from '@/actions/UploadActions';

const UploadForm = () => {
    const formRef=useRef();
    const [files, setFiles] = useState([]);
    async function handleInputFiles (e){
        const files = e.target.files;
       const newfiles= [...files].filter(file =>{if (file.size < 1024 * 1024 && file.type.startsWith('image/')){
              return file;
            }});
       setFiles(prev => [...newfiles, ...prev]);
            formRef.current.reset();
       }
    async function handleDeleteFiles (index){
        const newfiles = files.filter((_,i)=> i !== index);
        setFiles(newfiles);
    }
    async function handleUpload (){
        if(!files.length) return alert('No image files are selected');
        if(files.length > 3) return alert('Only 3 image files are allowed');
        const formData = new FormData();

        files.forEach(file => formData.append('files', file));
        const res= await uploadPhoto(formData,"Home-Photos");
        if(res?.msg) alert(res?.msg);
        if(res?.errMsg) alert(`Error: ${res?.errMsg}`);
        setFiles([]);
        formRef.current.reset();
        revalidate('/');
    }
    
    
  return (
    <form action={handleUpload} ref={formRef}>
        <div style={{background : '#ddd', minHeight: 200,margin: '10px 0', padding: 10}}>
            <input type='file' accept='image/*' multiple onChange={handleInputFiles} />
        <h5 style={{color: 'red'}}>
            (*) Only accept image files less than 1MB in size. upto 5 photo files.
        </h5>
        {/* Preview Images */}
        <div style={{display: 'flex',gap:10,flexWrap:'wrap',margin:'10px 0'}}>
            {
                files.map((file,index)=>(
                    <PhotoCard key={index} url={URL.createObjectURL(file).toString()} onClick={()=>handleDeleteFiles(index)}/>
                    
                ))
            }
        </div>
        </div>
        <Buttonsubmit value="Upload to Cloudinary"/>
    </form>
  )
}

export default UploadForm 

// "use client"
// import {useRef, useState} from 'react'
// import VideoCard from './VideoCard'; // Assuming you have a VideoCard component for video preview
// import Buttonsubmit from './Buttonsubmit';
// import { uploadVideo } from '@/actions/UploadActions'; // Assuming you have a function to upload videos
 
// const UploadForm = () => {
//     const formRef=useRef();
//     const [files, setFiles] = useState([]);
//     async function handleInputFiles (e){
//         const files = e.target.files;
//        const newfiles= [...files].filter(file =>{if (file.size < 1024 * 1024 * 5 && file.type.startsWith('video/')){ // Adjust file size limit and type
//               return file;
//             }});
//        setFiles(prev => [...newfiles, ...prev]);
//             formRef.current.reset();
//        }
//     async function handleDeleteFiles (index){
//         const newfiles = files.filter((_,i)=> i !== index);
//         setFiles(newfiles);
//     }
//     async function handleUpload (){
//         if(!files.length) return alert('No video files are selected');
//         if(files.length > 5) return alert('Only 3 video files are allowed'); // Update alert message
//         const formData = new FormData();
//         files.forEach(file => formData.append('files', file));
//         const res= await uploadVideo(formData); // Update upload function
//     }
    
    
//   return (
//     <form action={handleUpload} ref={formRef}>
//         <div style={{background : '#ddd', minHeight: 200,margin: '10px 0', padding: 10}}>
//             <input type='file' accept='video/*' multiple onChange={handleInputFiles} /> // Accept video files
//         <h5 style={{color: 'red'}}>
//             (*) Only accept video files less than 5MB in size. upto 5 video files. // Update message
//         </h5>
//         {/* Preview Videos */}
//         <div style={{display: 'flex',gap:10,flexWrap:'wrap',margin:'10px 0'}}>
//             {
//                 files.map((file,index)=>(
//                     <VideoCard key={index} url={URL.createObjectURL(file)} onClick={()=>handleDeleteFiles(index)}/> // Update to VideoCard
//                 ))
//             }
//         </div>
//         </div>
//         <Buttonsubmit value="Upload to Cloudinary"/>
//     </form>
//   )
// }

// export default UploadForm