import './fullContent.css'
interface FullContentProps {
    title?: string,
    des?: string,
    price?: string,
    link?: string,
    image?: string
}
const FullContent= ({title,des,price, link,image }: FullContentProps)=> {
    return (
        <div className='position-relative w-100 h-100 d-flex justify-content-center'>
            <img className='object-cover position-absolute z-0 h-100 w-100' src={image || "https://im.uniqlo.com/global-cms/spa/resfa01e6896858ad4ddae21ef83d6da147fr.jpg"} alt="" />
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