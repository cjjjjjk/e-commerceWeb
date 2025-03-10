import { useState } from 'react'
import './fullContent.css'
interface FullContentProps {
    title?: string,
    des?: string,
    price?: string,
    link?: string,
    image?: string
}
const FullContent= ({title,des,price, link,image }: FullContentProps)=> {

    const [imageURL, setImgaeURL] = useState(image || 'images/fullcontent-default.jpg')

    return (
        <div className='content-full-container position-relative w-100 h-100 d-flex justify-content-center align-items-center'>
            <img 
                className='object-cover position-absolute z-0 h-100 w-100' 
                src={imageURL} 
                onError={()=>setImgaeURL('images/fullcontent-default.jpg')}
                />
            <div className="position-relative z-2 content-container h-100 d-flex flex-column justify-content-center">
                <div className='content__title'>{title?.toUpperCase()}</div>
                <div className="content__des">{des}</div>
                <div className='content__price'>{price}</div>
                <div className='content__link'>{link}</div>
            </div>
        </div>
    )
}
export default FullContent;