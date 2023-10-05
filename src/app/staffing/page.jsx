
"use client"
import SVG from '../../libs/svg'
import { useState, useEffect, useRef } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import GET_USER from '@/queries/fetchUser'
import ADD_SETTINGS from '@/mutations/addSettings'
import ADD_ALLOCATION from '@/mutations/addAllocation'
import UPDATE_ALLOCATION from '@/mutations/updateAllocation'
import ADD_FILLBAR from '@/mutations/addFillBar'
import UPDATE_FILLBAR from '@/mutations/updateFillBar'
import DELETE_FILLBAR from '@/mutations/deleteFillbar'
import DELETE_ALLOCATION from '@/mutations/deleteAllocation'
import UPLOAD_ALLOCATION from '@/mutations/uploadAllocation'

//// HELPERS
import { defaultAllocationOrderTwo, defaultAllocationOrderThree } from '@/helpers/table';
import { onDragStart, onDragOver, onDrop, onDropFillBar, onDragStartFillBar } from '@/helpers/draggable';
import { sumByType, sum } from '@/helpers/utilities';

//// COMPONENTS
import DropDown from '../../component/dropDown'

const Staffing = ({}) => {

  const [ headingSettings, setHeadingSettings ] = useState([])
  const [ allocations, setAllocations ] = useState([])
  const [ listTwo, setListTwo] = useState([])
  const [ listThree, setListThree] = useState([])
  const [ updatedAllocation, setUpdatedAllocation ] = useState('')
  const [ updatedFillbar, setUpdatedFillbar] = useState('')
  const [ files, setFiles] = useState('')
  const dataUser = useQuery(GET_USER)
  const [ addSettings, { data, loading, error }] = useMutation(ADD_SETTINGS);
  const [ addAllocation, { dataAllocation, loadingAllocation, errorAllocation }] = useMutation(ADD_ALLOCATION, { refetchQueries: [ GET_USER ] });
  const [ updateAllocationMutation, { dataUpdateAllocation, loadingUpdateAllocation, errorUpdatedAllocation }] = useMutation(UPDATE_ALLOCATION, { refetchQueries: [ GET_USER ]});
  const [ addFillBar, { dataAddFillBar, loadingAddFillBar, errorAddFillBar }] = useMutation(ADD_FILLBAR, { refetchQueries: [ GET_USER ]});
  const [ updateFillBar, { dataUpdateFillBar, loadingUpdateFillBar, errorUpdateFillBar }] = useMutation(UPDATE_FILLBAR, { refetchQueries: [ GET_USER ]})
  const [ deleteFillbar, { dataDeleteFillbar, loadingDeleteFillbar, errorDeleteFillbar }] = useMutation(DELETE_FILLBAR, { refetchQueries: [ GET_USER ]})
  const [ deleteAllocation, { dataDeleteAllocation, loadingDeleteAllocation, errorDeleteAllocation }] = useMutation(DELETE_ALLOCATION, { refetchQueries: [ GET_USER ]})
  const [ uploadAllocation, { dataUploadAllocation, loadingUploadAllocation, errorUploadAllocation }] = useMutation(UPLOAD_ALLOCATION, { refetchQueries: [ GET_USER ]})
  const [ sortTwo, setSortTwo ] = useState(false)
  const [ sortThree, setSortThree ] = useState(false)
  const [ isTyping, setIsTyping ] = useState('');
  const [ isHovered, setHovered ] = useState('');
  const elementsWithIdRef = useRef([]);

  useEffect(() => {

    let newAllocations = []

    if(dataUser.data) setHeadingSettings(dataUser.data.user.settings)
    if(dataUser.data){
      newAllocations = [...dataUser.data.user.allocations]

      let orderTwo    = newAllocations.filter( (item) => { if(item.order == 2) return item })
      let orderThree  = newAllocations.filter( (item) => { if(item.order == 3) return item })

      setListTwo(orderTwo)
      setListThree(orderThree)
      setAllocations(newAllocations)
    }
    
  }, [dataUser])

  useEffect(() => {
    let typingTimer;

    if (isTyping) {

      clearTimeout(typingTimer); // Clear any previous timers

      // Set a new timer to submit the form after 1000ms (adjust as needed)
      typingTimer = setTimeout(() => {
        
        if(isTyping == 'headings') submitAddSettings();
        if(isTyping == 'allocations') submitUpdateAllocation();
        if(isTyping == 'fillBars') submitUpdateFillbar();

      }, 1200);
    }
    
    return () => {
      clearTimeout(typingTimer); // Cleanup the timer when the component unmounts
    };

  }, [headingSettings, allocations, isTyping])

  const updateHeadingSetting = (order, newValue) => {

    const newContent = newValue

    const updatedSettings = headingSettings.map(( item ) => {

      return item.order === order ? { ...item, content: newContent } : item
      
    })

    setHeadingSettings(updatedSettings)
    setIsTyping('headings')
    
  }

  const submitAddSettings = () => {
    addSettings({ variables: { userID: '65123ca1b69d3defa682bf2f', settings: headingSettings } })
    setIsTyping('')
  }
  

  const updateAllocationItems = ( id, type, newText ) => {
    
    let updateAllocation = allocations.find((item) => {
      if(item.id === id) return item
    })

    updateAllocation = { ...updateAllocation, [type]: newText }
    delete updateAllocation.fillBars
    setUpdatedAllocation(updateAllocation)
    
    const updatedAllocations = allocations.map(( item ) => {

      return item.id === id ? { ...item, [type]: newText } : item
      
    })

    setAllocations(updatedAllocations)
    setIsTyping('allocations')
    
  }

  const submitUpdateAllocation = () => {
    updateAllocationMutation({ variables: { allocationID: updatedAllocation.id, userID: dataUser.data.user.id, allocation: updatedAllocation } })
    setIsTyping('')
  }

  const updateFillBarData = ( id, idx, type, newText ) => {

    // Create a copy of the state
    const parentObject = allocations.find((obj) => obj.id === id );
    const newData = {...parentObject}
    
    const fillBar = newData.fillBars.find((item, idxItem) => idxItem === idx )
    const newFillBar = { ...fillBar }
    newFillBar[type] = newText
    
    const fillBars = [...newData.fillBars]
    
    fillBars[idx] = newFillBar
    newData.fillBars = fillBars
    
    const newAllocations = allocations.map((item) => {
      return item.id === newData.id ? newData : item
    })

    setUpdatedAllocation(newData)
    setUpdatedFillbar(newFillBar)
    setAllocations(newAllocations)
    setIsTyping('fillBars')

  }

  const submitUpdateFillbar = async () => {

    updateFillBar({ 
      variables: { allocationID: updatedAllocation.id, fillBars: updatedAllocation.fillBars, userID: dataUser.data.user.id, fillBar: updatedFillbar },
      optimisticResponse: {
        __typename: "Mutation",
        user: {
          allocations: allocations,
          id: dataUser.data.user.id,
          settings: headingSettings,
          username: "Test"
        }
      }
    })
    
    setIsTyping('')

  }

  const handleOnDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let data = onDrop(e)

    if(!data) return 

    delete data.allocation.allocation.fillBars
    delete data.pickedContainer.fillBars
    addFillBar({ variables: { allocationID: data.onDropId, allocation: data.allocation.allocation, userID: dataUser.data.user.id, pickedContainer: data.pickedContainer } })
    setIsTyping('')
    
  }

  const handleOnDropFillbar = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let data = onDropFillBar(e)
    
    updateFillBar({ variables: { allocationID: data.id, fillBars: data.fillBars, userID: dataUser.data.user.id, fillBar: {} } }) 
    setIsTyping('')

  }

  const handleDeleteFillbar = (e, allocation, deleteId) => {
    e.preventDefault()

    let newObject = { ...allocation }

    delete newObject.fillBars
    deleteFillbar({ variables: { allocation: newObject, userID: dataUser.data.user.id, deleteId: deleteId } })
    setIsTyping('')

  }

  const handleDeleteAllocation = (e, allocation) => {
    e.preventDefault()

    let newObject = { ...allocation }

    delete newObject.fillBars
    deleteAllocation({ variables: { allocation: newObject, userID: dataUser.data.user.id } })
    setIsTyping('')

  }

  const glowAll = (id) => {
    const elementsWithId = document.querySelectorAll(`[id="${id}"`);
    
    // Convert the NodeList to an array
    const elementsArray = Array.from(elementsWithId);
    
    // Store the array of elements in the ref
    elementsWithIdRef.current = elementsArray;
    
    // Now, you can access the elements using elementsWithIdRef.current
    elementsWithIdRef.current.forEach(element => {
      // Do something with each element
      if (element.classList.contains('element-button-allocation')) {
        if(element.classList.contains(('glow'))) return element.classList.remove("glow")
        element.classList.add("glow")
      }
    });
  }

  useEffect(() => {
    if(files) submitFileUpload()
  }, [files])

  const submitFileUpload = () => {
  
    const object = new Object()
    object.fileName = files.name
    object.type     = files.type

    uploadAllocation({ variables: { file: object} })
    
  }

  const changeSort = (sortType, listType) => {
    
    if(listType == 'two'){
      let newList = []
      
      if(sortType == 'text'){
        newList = allocations
          .slice()
          .sort( (a, b) => {

          const textA = a[sortType].toLowerCase();
          const textB = b[sortType].toLowerCase();

          if (textA < textB) return sortTwo ? -1 : 1;
          if (textA > textB) return sortTwo ? 1 : -1;
          return 0;

        }).filter((item) => {
          if(item.order == 2) return item
        })
      }

      if(sortType !== 'text'){
        newList = allocations.sort( (a, b) => {

          const numA = parseFloat(a[sortType]);
          const numB = parseFloat(b[sortType]);
          
          if (numA < numB) return sortTwo ? 1 : -1;
          if (numA > numB) return sortTwo ? -1 : 1;
          return 0;

        }).filter((item) => {
          if(item.order == 2) return item
        })
      }

      setSortTwo(!sortTwo)
      setListTwo(newList)

    }

    if(listType == 'three'){
      let newList = []
      
      if(sortType == 'text'){
        newList = allocations
          .slice()
          .sort( (a, b) => {

            const textA = a[sortType].toLowerCase();
            const textB = b[sortType].toLowerCase();

            if (textA < textB) return sortThree ? -1 : 1;
            if (textA > textB) return sortThree ? 1 : -1;
            return 0;

          }).filter((item) => {
          if(item.order == 3) return item
        })
      }

      if(sortType !== 'text'){
        newList = allocations.sort( (a, b) => {

          const numA = parseFloat(a[sortType]);
          const numB = parseFloat(b[sortType]);
          
          if (numA < numB) return sortThree ? 1 : -1;
          if (numA > numB) return sortThree ? -1 : 1;
          return 0

        }).filter((item) => {
          if(item.order == 3) return item
        })
      }

      setSortThree(!sortThree)
      setListThree(newList)

    }
    
  }

  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;
  if (loadingAllocation) return 'Submitting...';
  if (errorAllocation) return `Submission error! ${errorAllocation}`;
  if (loadingUpdateAllocation) return 'Submitting...';
  if (errorUpdatedAllocation) `Submission error! ${errorUpdatedAllocation}`;
  
  return (
    <div className="container-center wrap">
      <div className="container-flex-right whalf h5 border-right">
        <div 
          className="element-button-icon"
          onClick={() => addAllocation( { variables: defaultAllocationOrderTwo } )}
        >
          <SVG svg={'plus'}></SVG>
        </div>
        <div className="element-buttonFile">
          <label 
            className="curved"
            htmlFor="importAllocation"
          >
            import
          </label>
          <input 
            type="file"
            id="importAllocation"
            className="element-button-text curved"
            onChange={(e) => setFiles(e.target.files[0])}
          >
          </input>
        </div>
      </div>
      <div className="container-flex-left whalf h5">
        <div 
          className="element-button-icon"
          onClick={() => addAllocation( { variables: defaultAllocationOrderThree } )}
        >
          <SVG svg={'plus'}></SVG>
        </div>
        <div 
          className="element-button-text curved"
        >
          import
        </div>
      </div>


      <div className="container-flex-right whalf border-right">
        <input 
          type="text"
          className="element-button-text curved-eased wfull schemeTwo-background fontSize-16 capitalize"
          value={ headingSettings.length > 0 ? headingSettings.find(( item ) =>  item.order === 1).content : 'Districts' }
          onChange={(e) => updateHeadingSetting(1, e.target.value) }
        >
        </input>
        <input 
          type="text"
          className="element-button-text curved-eased w20 schemeOne-background fontSize-16 capitalize"
          value={ headingSettings.length > 0 ? headingSettings.find(( item ) =>  item.order === 2).content : 'Employees'}
          onChange={(e) => updateHeadingSetting(2, e.target.value) }
        >
        </input>
        <div 
          className="element-button-icon"
        >
          <DropDown
            changeSort={changeSort}
            listType="two"
            allocations={allocations}
          >
          </DropDown>
        </div>
      </div>
      <div className="container-flex-left whalf">
        <div 
          className="element-button-icon"
        >
          <DropDown
            changeSort={changeSort}
            listType="three"
            allocations={allocations}
          >
          </DropDown>
        </div>
        <input
          type="text"
          className="element-button-text curved-eased w20 schemeFour-background capitalize"
          value={ headingSettings.length > 0 ? headingSettings.find(( item ) =>  item.order === 3).content : 'Locations'}
          onChange={(e) => updateHeadingSetting(3, e.target.value) }
        >
        </input>
        <input 
          type="text"
          className="element-button-text curved-eased wfull fontSize-16 capitalize schemeFive-background darkContrast"
          value={ headingSettings.length > 0 ? headingSettings.find(( item ) =>  item.order === 4).content : 'Allocations'}
          onChange={(e) => updateHeadingSetting(4, e.target.value) }
        >
        </input>
      </div>
      {/* .sort( (a, b) => a.text > b.text ? descend : ascend) */}
      <div className="scrollHorizontal whalf scrollVertical freezedPanes">
      <div className="w100">
      { listTwo.length > 0 && Array.isArray(listTwo) && listTwo.map(( allocation, idx ) => 
        allocation.order == 2 &&
        <div 
          id={allocation.id}
          key={idx}
          className="lightGray-background curved"
          onDragOver={(e)=> onDragOver(e)}
          onDrop={(e) => handleOnDrop(e)}
        >
          <div className="container-flex-right wfull">
            <div className="container-flex-right wfull h10 fontSize-16 capitalize scrollReverse">
              { allocation.fillBars.map( ( fillBar, idx) => 
                <div 
                  key={idx}
                  id={fillBar.id}
                  className="element-button-allocation curved-eased lightContrast schemeTwo fontSize-12 capitalize h6"
                  draggable
                  onDragOver={(e)=> onDragOver(e)}
                  onDragStart={(e) => onDragStartFillBar(e, fillBar, allocation.id, allocation)}
                  onDrop={(e) => handleOnDropFillbar(e, allocation)}
                  onMouseEnter={() => setHovered(`hover${fillBar.id}${allocation.id}`)}
                  onMouseLeave={() => setHovered('')}
                  onClick={() => glowAll(fillBar.id)}
                >
                  { isHovered == `hover${fillBar.id}${allocation.id}` &&
                    <div 
                      className="elementSvgContainer"
                      onClick={(e) => handleDeleteFillbar(e, allocation, fillBar.id)}
                    >
                      <SVG svg={'thrashCan'}></SVG>
                    </div>
                  }
                  <div 
                    className="progressBar schemeTwoAbsolute curved-eased"
                    style={{ width: `${ Math.min(100, Math.max(0, (fillBar.allocation/fillBar.fte) * 100 ))}%` }}
                  >
                  </div>
                  <input 
                    type="text"
                    className="elementInnerBox schemeTwo"
                    value={ fillBar.allocation ? parseFloat(fillBar.allocation.replace(/(\.\d*?[1-9])0+$/g, '$1')) : ''}
                    readOnly
                    // onChange={(e) => updateFillBarData(allocation.id, idx, 'allocation', e.target.value) }
                  >
                  </input>
                  <input 
                    type="text"
                    className="elementInnerText darkContrast curved-eased"
                    value={ fillBar.text }
                    readOnly
                    // onChange={(e) => updateFillBarData(allocation.id, idx, 'text', e.target.value) }
                  >
                  </input>
                  {/* <input 
                    type="text"
                    className="elementInnerBox schemeTwo"
                    value={ fillBar.fte }
                    onChange={(e) => updateFillBarData(allocation.id, idx, 'fte', e.target.value) }
                  >
                  </input> */}
              </div>
            )}
            </div>
            <div 
              id={allocation.id}
              className="element-button-allocation w20 curved-eased lightContrast schemeOne fontSize-12 capitalize h6"
              draggable
              onDragStart={(e) => onDragStart(e, allocation, allocations)}
              onMouseEnter={() => setHovered(`hover${allocation.id}${idx}`)}
              onMouseLeave={() => setHovered('')}
              onClick={() => glowAll(allocation.id)}
            >
              { isHovered == `hover${allocation.id}${idx}` &&
                <div 
                  onClick={(e) => handleDeleteAllocation(e, allocation)}
                  className="elementSvgContainer">
                    <SVG svg={'thrashCan'}></SVG>
                </div>
              }
              <div 
                className="progressBar schemeOneAbsolute curved-eased"
                style={{ width: `${ Math.min(100, Math.max(0, (allocation.allocation/allocation.fte) * 100 ))}%`  }}
              >
              </div>
              <input 
                type="text"
                className="elementInnerBox schemeTwo"
                value={ allocation.fte }
                onChange={(e) => updateAllocationItems(allocation.id, 'fte', e.target.value) }
              >
              </input>
              <input 
                type="text"
                className="elementInnerText darkContrast curved-eased"
                value={ allocation.text }
                onChange={(e) => updateAllocationItems(allocation.id, 'text', e.target.value) }
              >
              </input>
              <input 
                type="text"
                className={`elementInnerBox schemeTwo ${allocation.allocation > allocation.fte ? ' redText' : ''}`}
                value={ allocation.allocation ? parseFloat(allocation.allocation.replace(/(\.\d*?[1-9])0+$/g, '$1')) : '' }
                readOnly
                // onChange={(e) => updateAllocationItems(allocation.id, 'allocation', e.target.value) }
              >
              </input>
            </div>
          </div>       
        </div>
      )}
      </div>
      </div>
      
      <div className="scrollHorizontal whalf scrollVertical freezedPanes">
      <div className="w100">
        { listThree && listThree.map(( allocation, idx ) => 
          allocation.order == 3 &&
          <div 
            id={allocation.id}
            key={idx}
            className="lightGray-background curved"
            onDragOver={(e)=> onDragOver(e)}
            onDrop={(e) => handleOnDrop(e)}
          >
            <div className="container-flex-left wfull">
              <div 
                id={allocation.id}
                className="element-button-allocation w20 curved-eased lightContrast schemeFour fontSize-12 capitalize h6"
                draggable
                onDragStart={(e) => onDragStart(e, allocation, allocations)}
                onMouseEnter={() => setHovered(`hover${allocation.id}${idx}`)}
                onMouseLeave={() => setHovered('')}
                onClick={() => glowAll(allocation.id)}
              >
                { isHovered == `hover${allocation.id}${idx}` &&
                  <div 
                    onClick={(e) => handleDeleteAllocation(e, allocation)}
                    className="elementSvgContainer">
                      <SVG svg={'thrashCan'}></SVG>
                  </div>
                }
                <div 
                  className="progressBar schemeFourAbsolute curved-eased"
                  style={{ width: `${ Math.min(100, Math.max(0, (allocation.allocation/allocation.fte) * 100 ))}%`  }}
                >
                </div>
                <input 
                  type="text"
                  className="elementInnerBox schemeFour"
                  value={ allocation.fte }
                  onChange={(e) => updateAllocationItems(allocation.id, 'fte', e.target.value) }
                >
                </input>
                <input 
                  type="text"
                  className="elementInnerText darkContrast curved-eased"
                  value={ allocation.text }
                  onChange={(e) => updateAllocationItems(allocation.id, 'text', e.target.value) }
                >
                </input>
                <input
                  type="text"
                  className="elementInnerBox schemeFour"
                  value={ allocation.allocation ? parseFloat(allocation.allocation.replace(/(\.\d*?[1-9])0+$/g, '$1')) : ''}
                  readOnly
                  // onChange={(e) => updateAllocationItems(allocation.id, 'allocation', e.target.value) }
                >
                </input>
              </div>
              
              <div className="container-flex-left wfull h10 fontSize-16 capitalize scrollHorizontal">
                { allocation.fillBars && allocation.fillBars.map(( fillBar, idx) => 
                <div 
                  key={idx}
                  id={fillBar.id}
                  draggable
                  onDragOver={(e)=> onDragOver(e)}
                  onDragStart={(e) => onDragStartFillBar(e, fillBar, allocation.id, allocation)}
                  onDrop={(e) => handleOnDropFillbar(e, allocation)}
                  className="element-button-allocation curved-eased lightContrast schemeFive fontSize-12 capitalize h6"
                  onMouseEnter={() => setHovered(`hover${fillBar.id}${allocation.id}`)}
                  onMouseLeave={() => setHovered('')}
                  onClick={() => glowAll(fillBar.id)}
                >
                  { isHovered == `hover${fillBar.id}${allocation.id}` &&
                    <div 
                      className="elementSvgContainer"
                      onClick={(e) => handleDeleteFillbar(e, allocation, fillBar.id)}
                    >
                      <SVG svg={'thrashCan'}></SVG>
                    </div>
                  }
                  <div 
                    className="progressBar schemeFiveAbsolute curved-eased"
                    style={{ width: `${ Math.min(100, Math.max(0, (fillBar.allocation/fillBar.fte) * 100 ))}%` }}
                  >
                  </div>
                  {/* <input 
                    type="text"
                    className="elementInnerBox schemeFive"
                    value={ fillBar.fte }
                    onChange={(e) => updateFillBarData(allocation.id, idx, 'fte', e.target.value) }
                  >
                  </input> */}
                  <input 
                    type="text"
                    className="elementInnerText darkContrast curved-eased"
                    value={ fillBar.text }
                    onChange={(e) => updateFillBarData(allocation.id, idx, 'text', e.target.value) }
                  >
                  </input>
                  <input 
                    type="text"
                    className="elementInnerBox schemeFive"
                    value={ fillBar.allocation ? fillBar.allocation.replace(/(\.\d*?[1-9])0+$/g, '$1') : '' }
                    onChange={(e) => updateFillBarData(allocation.id, idx, 'allocation', e.target.value) }
                  >
                  </input>
                </div>
                )}
              </div>

              </div>
          </div>
        )}
      </div>
      </div>

      <div className="container-flex-right whalf border-right">
        <div 
          className="element-button-total curved-eased lightContrast schemeOne fontSize-12 capitalize h6"
        >
          <div className="elementInnerBox schemeOne">
            {parseFloat(sumByType(allocations, 'fte', 2))}
          </div>
          <div className="elementInnerBox schemeOne">
            {parseFloat(sum(allocations, 2))}
          </div>
          <div className="elementInnerBox schemeOne">
            {parseFloat(sumByType(allocations, 'allocation', 2))}
          </div>
        </div>
      </div>
      
      <div className="container-flex-left whalf">
        <div 
          className="element-button-total curved-eased lightContrast schemeFour fontSize-12 capitalize h6"
        >
          <div className="elementInnerBox schemeFour">
            {parseFloat(sumByType(allocations, 'fte', 3))}
          </div>
          <div className="elementInnerBox schemeFour">
            {parseFloat(sum(allocations, 2))}
          </div>
          <div className="elementInnerBox schemeFour">
            {parseFloat(sumByType(allocations, 'allocation', 3))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Staffing
