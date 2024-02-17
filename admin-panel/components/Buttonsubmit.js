"use client"
import {experimental_useFormStatus as useFormStatus} from 'react-dom'

const Buttonsubmit = ({value,...props}) => {
    const {pending}=useFormStatus();
  return (
    <button type='submit' disabled={pending} {...props}>
        {pending ? 'Uploading...' : value}
    </button>
  )
}

export default Buttonsubmit