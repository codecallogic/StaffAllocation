
const SVG = ({svg, width, height, classprop, color}) => {

  const selectSVG = (svg) => {
    switch(svg){

      case 'plus':
        return <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 24">
          <path fill={color} d="M5 13h6v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6h6c0.552 0 1-0.448 1-1s-0.448-1-1-1h-6v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1v6h-6c-0.552 0-1 0.448-1 1s0.448 1 1 1z"></path>
          </svg> 
        break;

      case 'thrashCan':
        return <svg width={width} heigth={height} viewBox="0 0 32 32">
          <path fill={color} d="M6 32h20l2-22h-24zM20 4v-4h-8v4h-10v6l2-2h24l2 2v-6h-10zM18 4h-4v-2h4v2z"></path>
          </svg> 
        break;

      case 'sort':
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 32">
            <path d="M16 17c0 0.266-0.109 0.516-0.297 0.703l-7 7c-0.187 0.187-0.438 0.297-0.703 0.297s-0.516-0.109-0.703-0.297l-7-7c-0.187-0.187-0.297-0.438-0.297-0.703 0-0.547 0.453-1 1-1h14c0.547 0 1 0.453 1 1zM16 11c0 0.547-0.453 1-1 1h-14c-0.547 0-1-0.453-1-1 0-0.266 0.109-0.516 0.297-0.703l7-7c0.187-0.187 0.438-0.297 0.703-0.297s0.516 0.109 0.703 0.297l7 7c0.187 0.187 0.297 0.438 0.297 0.703z"></path>
          </svg> 
        break;
        
      case 'dropdown':
        return <svg id="icon-list" viewBox="0 0 24 24">
          <path d="M3 12.984v-1.969h12v1.969h-12zM3 6h18v2.016h-18v-2.016zM3 18v-2.016h6v2.016h-6z"></path>
        </svg> 
        break;

      case 'close':
        return <svg id="icon-cross" viewBox="0 0 32 32" width={width} height={height}>
          <path fill={color} d="M31.708 25.708c-0-0-0-0-0-0l-9.708-9.708 9.708-9.708c0-0 0-0 0-0 0.105-0.105 0.18-0.227 0.229-0.357 0.133-0.356 0.057-0.771-0.229-1.057l-4.586-4.586c-0.286-0.286-0.702-0.361-1.057-0.229-0.13 0.048-0.252 0.124-0.357 0.228 0 0-0 0-0 0l-9.708 9.708-9.708-9.708c-0-0-0-0-0-0-0.105-0.104-0.227-0.18-0.357-0.228-0.356-0.133-0.771-0.057-1.057 0.229l-4.586 4.586c-0.286 0.286-0.361 0.702-0.229 1.057 0.049 0.13 0.124 0.252 0.229 0.357 0 0 0 0 0 0l9.708 9.708-9.708 9.708c-0 0-0 0-0 0-0.104 0.105-0.18 0.227-0.229 0.357-0.133 0.355-0.057 0.771 0.229 1.057l4.586 4.586c0.286 0.286 0.702 0.361 1.057 0.229 0.13-0.049 0.252-0.124 0.357-0.229 0-0 0-0 0-0l9.708-9.708 9.708 9.708c0 0 0 0 0 0 0.105 0.105 0.227 0.18 0.357 0.229 0.356 0.133 0.771 0.057 1.057-0.229l4.586-4.586c0.286-0.286 0.362-0.702 0.229-1.057-0.049-0.13-0.124-0.252-0.229-0.357z"></path>
          </svg>
        break;

      case 'pallete':
        return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="m12,2C6.48,2,2,6.48,2,12s4.48,10,10,10,10-4.48,10-10S17.52,2,12,2Zm0,14c-2.21,0-4-1.79-4-4s1.79-4,4-4,4,1.79,4,4-1.79,4-4,4Z" style={{ fill: "#e63946" }}/>
          <path d="m12,2v6c-1.1,0-2.1.45-2.83,1.17l-4.24-4.24c1.81-1.81,4.31-2.93,7.07-2.93Z" style={{ fill: "#20bf55" }}/>
          <path d="m22,12h-6c0-1.1-.45-2.1-1.17-2.83l4.24-4.24c1.81,1.81,2.93,4.31,2.93,7.07Z" style={{ fill: "#fcbf49" }}/>
          <path d="m22,12c0,2.76-1.12,5.26-2.93,7.07l-4.24-4.24c.72-.73,1.17-1.73,1.17-2.83h6Z" style={{ fill: "#3a8def" }}/>
          <path d="m19.07,19.07c-1.81,1.81-4.31,2.93-7.07,2.93v-6c1.1,0,2.1-.45,2.83-1.17l4.24,4.24Z" style={{ fill: "#109138" }}/>
          <path d="m12,16v6c-2.76,0-5.26-1.12-7.07-2.93l4.24-4.24c.73.72,1.73,1.17,2.83,1.17Z" style={{ fill: "#c9273a" }}/>
          <path d="m9.17,14.83l-4.24,4                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         .24c-1.81-1.81-2.93-4.31-2.93-7.07h6c0,1.1.45,2.1,1.17,2.83Z" style={{ fill: "#0b4f6c" }}/>
          <path d="m9.17,9.17c-.72.73-1.17,1.73-1.17,2.83H2c0-2.76,1.12-5.26,2.93-7.07l4.24,4.24Z" style={{ fill: "#2675e2" }}/>
        </svg>
        break;

      case 'account':
        return <svg height={width} version="1.1" viewBox="0 0 20 20" width={width}>
          <title/>
          <desc/><defs/>
          <g fill="none" fillRule="evenodd" id="Page-1" stroke="none" strokeWidth="1">
          <g fill={schemeOne} id="Core" transform="translate(-86.000000, -2.000000)"><g id="account-circle" transform="translate(86.000000, 2.000000)">
          <path d="M10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0 L10,0 Z M10,3 C11.7,3 13,4.3 13,6 C13,7.7 11.7,9 10,9 C8.3,9 7,7.7 7,6 C7,4.3 8.3,3 10,3 L10,3 Z M10,17.2 C7.5,17.2 5.3,15.9 4,14 C4,12 8,10.9 10,10.9 C12,10.9 16,12 16,14 C14.7,15.9 12.5,17.2 10,17.2 L10,17.2 Z" id="Shape"/>
          </g>
          </g>
          </g>
        </svg>    
        break;

      case 'arrowDown':
        return <svg viewBox="0 0 24 24" width={width} height={height}>
          <path fill={color} d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm4.71,10.71-4,4a1,1,0,0,1-1.41,0l-4-4a1,1,0,0,1,1.41-1.41L12,13.59l3.29-3.29a1,1,0,0,1,1.41,1.41Z"/>
        </svg>  
        break;

      case 'edit':
        return <svg width={width} height={height} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
          <path fill={"transparent"}  d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path fill={color}  d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>  
        break;

      case 'users':
        return <svg version="1.0" viewBox="0 0 24 24" width={width} height={height}>
          <g>
            <path fill={color} d="M9,9c0-1.7,1.3-3,3-3s3,1.3,3,3c0,1.7-1.3,3-3,3S9,10.7,9,9z M12,14c-4.6,0-6,3.3-6,3.3V19h12v-1.7C18,17.3,16.6,14,12,14z   "/>
            </g><g><g><circle cx="18.5" cy="8.5" r="2.5"/></g><g>
            <path fill={color} d="M18.5,13c-1.2,0-2.1,0.3-2.8,0.8c2.3,1.1,3.2,3,3.2,3.2l0,0.1H23v-1.3C23,15.7,21.9,13,18.5,13z"/></g></g><g><g><circle fill={color}cx="18.5" cy="8.5" r="2.5"/></g><g>
            <path fill={color} d="M18.5,13c-1.2,0-2.1,0.3-2.8,0.8c2.3,1.1,3.2,3,3.2,3.2l0,0.1H23v-1.3C23,15.7,21.9,13,18.5,13z"/></g></g><g><g><circle fill={color} cx="5.5" cy="8.5" r="2.5"/></g><g>
            <path fill={color} d="M5.5,13c1.2,0,2.1,0.3,2.8,0.8c-2.3,1.1-3.2,3-3.2,3.2l0,0.1H1v-1.3C1,15.7,2.1,13,5.5,13z"/></g></g>
        </svg>
        break;

      case 'edit2':
        return <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 20 20" width={width} heigh={height}>
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
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
