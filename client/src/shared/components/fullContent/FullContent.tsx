import { useEffect, useRef, useState } from 'react'
import './fullContent.css'
import { ProductCardProps, ProductCard } from '../product-card/ProductCard'
import { useNavigate } from 'react-router-dom'

interface FullContentProps {
  title?: string
  des?: string
  price?: string
  link?: string
  image?: string,
  cateLabel?: {
    id: string
    name: string,
    crrGender: string
  },
  productList?: ProductCardProps[],
  loading?: boolean
}

const FullContent = ({ title, des, price, link, image, productList, cateLabel, loading }: FullContentProps) => {
  const navigate = useNavigate()
  const [imageURL, setImgaeURL] = useState(image || 'images/fullcontent-default.jpg')
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const container = scrollRef.current
    const scrollAmount = 300
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }

  useEffect(() => {
  }, [productList])

  const naviHandler= function(to: string, cateId?: string) {
    window.sessionStorage.setItem('crrCateId', cateId || "");
    navigate(to);
    }   
    const normalizeStringToPath = (name: string): string => {
        return name
            .normalize("NFD") 
            .replace(/[\u0300-\u036f]/g, "") 
            .replace(/đ/g, "d")
            .toLowerCase() 
            .replace(/\s+/g, "-"); 
    };
  return (
    <div className='content-full-container position-relative w-100 h-100 d-flex justify-content-center align-items-center'>
      <img
        className='object-cover position-absolute z-0 h-100 w-100'
        src={imageURL}
        onError={() => setImgaeURL('images/fullcontent-default.jpg')}
      />
      <div className='position-relative z-2 content-container h-100 d-flex flex-column justify-content-end pb-3'>
        <div className='content__title'>{title?.toUpperCase()}</div>
        <div className='content__des'>{des}</div>
        {price && <div className='content__price'>{price}</div>}
        <div className='content__link'>{link}</div>
        {loading && <div className='content__loading h-25 mt-5 fs-2 text-white fw-bolder'><i className='fs-2 pi pi-spin pi-spinner'></i> &nbsp; Đang tải...</div>}
        {productList && productList.length > 0 ? (
          <div className='position-relative'>
            <br />
            <br />
            <br />
            {
                cateLabel && 
                <span className='list-label label-ad text-white px-2 fs-3 rounded-3 shadow-sm' 
                    onClick={()=>{
                        if(cateLabel.id)
                        naviHandler(`/${cateLabel.crrGender}/${normalizeStringToPath(cateLabel.name)}`, cateLabel.id)
                    }}
                >{String(cateLabel.name).toUpperCase()} <i className='pi pi-link'></i></span>
            }
                <div ref={scrollRef} className='content__product-list gap-1 no-scrollbar '>
                  {productList.length > 4 &&
                    <div className='scroll-buttons w-100 d-none d-md-flex justify-content-between align-items-center position-absolute top-50 mt-5 start-0 end-0 translate-middle-y px-2'>
                      <button className='btn btn-outline-dark rounded-circle shadow-lg' onClick={() => scroll('left')}><i className='pi pi-angle-left'></i></button>
                      <button className='btn btn-outline-dark rounded-circle shadow-lg' onClick={() => scroll('right')}><i className='pi pi-angle-right'></i></button>
                  </div>
                  }
                {productList.map((item, index) => (
                    <ProductCard key={index} {...item} isCardBorder={true} />
                ))}
                </div>
          </div>
        ) : (
          <br />
        )}
      </div>
    </div>
  )
}

export default FullContent
