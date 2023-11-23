
const SVG = ({svg, width, height, schemeOne, schemeTwo, schemeThree}) => {

  const selectSVG = (svg) => {
    switch(svg){

      case 'account':
        return <svg height={width} version="1.1" viewBox="0 0 20 20" width={width}>
          <title/>
          <desc/><defs/>
          <g fill="none" fill-rule="evenodd" id="Page-1" stroke="none" stroke-width="1">
          <g fill={schemeOne} id="Core" transform="translate(-86.000000, -2.000000)"><g id="account-circle" transform="translate(86.000000, 2.000000)">
          <path d="M10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0 L10,0 Z M10,3 C11.7,3 13,4.3 13,6 C13,7.7 11.7,9 10,9 C8.3,9 7,7.7 7,6 C7,4.3 8.3,3 10,3 L10,3 Z M10,17.2 C7.5,17.2 5.3,15.9 4,14 C4,12 8,10.9 10,10.9 C12,10.9 16,12 16,14 C14.7,15.9 12.5,17.2 10,17.2 L10,17.2 Z" id="Shape"/>
          </g>
          </g>
          </g>
        </svg>    
        break;
        
    }
  }
  
  return (
    <>
      {selectSVG(svg)}
    </>
  )
}

export default SVG
