
"use client"
import SVG from '../../libs/svg'
import { useState, useEffect, useRef } from 'react'
import { useMutation, useQuery } from '@apollo/client';
import { ExcelRenderer } from 'react-excel-renderer';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import GET_USER from '@/queries/fetchUser'
import GET_USERS from '@/queries/fetchUsers'
import ADD_SETTINGS from '@/mutations/addSettings'
import ADD_ALLOCATION from '@/mutations/addAllocation'
import UPDATE_ALLOCATION from '@/mutations/updateAllocation'
import ADD_FILLBAR from '@/mutations/addFillBar'
import UPDATE_FILLBAR from '@/mutations/updateFillBar'
import DELETE_FILLBAR from '@/mutations/deleteFillbar'
import DELETE_ALLOCATION from '@/mutations/deleteAllocation'
import UPLOAD_ALLOCATION from '@/mutations/uploadAllocation'
import ADD_YEAR from '@/mutations/addYear'
import ADD_TEAM from '@/mutations/addTeam'

//// HELPERS
import { onDragStart, onDragOver, onDrop, onDropFillBar, onDragStartFillBar } from '@/helpers/draggable';
import { sumByType, sum } from '@/helpers/utilities';

//// COMPONENTS
import Nav from '../_components/Navigation';
import DropDown from '../../component/dropDown'
import ColumnListRight from '@/component/columnListRight';
import ColumnListLeft from '@/component/columnListLeft';
import ColorPallete from '@/component/colorPallete'
import SystemAdmin from '../_components/SystemAdmin'
import AddYear from '../_components/AddYear'
import AddTeam from '../_components/AddTeam'

function Staffing () {

  const router = useRouter();

  const [cookies, setCookie, removeCookie] = useCookies(['accessToken', 'user']);
  const [ headingSettings, setHeadingSettings ] = useState([])
  const [ allocations, setAllocations ] = useState([])
  const [ updatedAllocation, setUpdatedAllocation ] = useState('')
  const [ updatedFillbar, setUpdatedFillbar] = useState('')
  const [ allUsers, setAllUsers] = useState([])
  const [ loadingData, setLoadingData ] = useState(false)
  const [ yearID, setYearID] = useState('')
  const [ years, setYears] = useState([])
  const [ teamID, setTeamID] = useState('')
  const [ popup, setPopup] = useState('')
  const [ loading, setLoading] = useState('')
  const [ submitError, setSubmitError] = useState('')

  const dataUser = useQuery(GET_USER, {
    variables: { id: cookies.user ? cookies.user.id : '', token: cookies.accessToken }
  })
  const users = useQuery(GET_USERS, { variables: { id: cookies.user ? cookies.user.id : ''} })
  const [ addSettings, { data, loadingSettings, errorSettings }] = useMutation(ADD_SETTINGS);
  const [ addAllocation, { dataAllocation, loadingAllocation, errorAllocation }] = useMutation(ADD_ALLOCATION, { refetchQueries: [ GET_USER ] });
  const [ updateAllocationMutation, { dataUpdateAllocation, loadingUpdateAllocation, errorUpdatedAllocation }] = useMutation(UPDATE_ALLOCATION, { refetchQueries: [ GET_USER ]});
  const [ addFillBar, { dataAddFillBar, loadingAddFillBar, errorAddFillBar }] = useMutation(ADD_FILLBAR, { refetchQueries: [ GET_USER ]});
  const [ updateFillBar, { dataUpdateFillBar, loadingUpdateFillBar, errorUpdateFillBar }] = useMutation(UPDATE_FILLBAR, { refetchQueries: [ GET_USER ]})
  const [ deleteFillbar, { dataDeleteFillbar, loadingDeleteFillbar, errorDeleteFillbar }] = useMutation(DELETE_FILLBAR, { refetchQueries: [ GET_USER ]})
  const [ deleteAllocation, { dataDeleteAllocation, loadingDeleteAllocation, errorDeleteAllocation }] = useMutation(DELETE_ALLOCATION, { refetchQueries: [ GET_USER ]})
  const [ uploadAllocation, { dataUploadAllocation, loadingUploadAllocation, errorUploadAllocation }] = useMutation(UPLOAD_ALLOCATION, { refetchQueries: [ GET_USER ]})
  const [ addYear, { dataAddYear, loadingAddYear, errorAddYear }] = useMutation(ADD_YEAR, { refetchQueries: [ GET_USER ]})
  const [ addTeam, { dataAddTeam, loadingAddTeam, errorAddTeam }] = useMutation(ADD_TEAM, { refetchQueries: [ GET_USER ]})
  const [ sortTwo, setSortTwo ] = useState(false)
  const [ sortThree, setSortThree ] = useState(false)
  const [ sortType, setSortType] = useState('')
  const [ isTyping, setIsTyping ] = useState('');
  const [ isHovered, setHovered ] = useState('');
  const [ colorPallete, setColorPallete ] = useState('')
  const [ palleteType, setPalleteType] = useState('')
  const [ sortLeftType, setSortLeftType] = useState('')
  const [ sortRightType, setSortRightType] = useState('')
  const elementsWithIdRef = useRef([]);
  const containerRefLeft    = useRef(null);
  const containerRefRight   = useRef(null);
  
  useEffect(() => {
    
    let newAllocations = []

    setLoadingData(true)
    // console.log(dataUser)
    if(dataUser.error){ 
      console.log('DATAUSER ERROR', dataUser.error)
      dataUser.error.message = 'Invalid token' ? router.push('/') : router.push('/error') 
    }

    if(!dataUser.error) setLoadingData(false)
    if(dataUser.data && dataUser.data.user.years.length > 0) setHeadingSettings(dataUser.data.user.years[0].teams[0].settings)
    if(dataUser.data && dataUser.data.user.years.length > 0){
      
      if(dataUser.data.user.years[0]){
        setYearID(dataUser.data.user.years[0].id)
        setYears(dataUser.data.user.years)
      }
      if(dataUser.data.user.years[0].teams[0]) setTeamID(dataUser.data.user.years[0].teams[0].id)
      newAllocations = [...dataUser.data.user.years[0].teams[0].allocations]
      newAllocations.sort((a, b) => a.order - b.order) 
    
      setAllocations(newAllocations)

      if(sortLeftType) changeSort(sortLeftType.type, sortLeftType.order)
      if(sortRightType) changeSort(sortRightType.type, sortRightType.order)

    }
    
  }, [dataUser])

  useEffect(() => {
    
    setLoadingData(true)
    
    if(users.error){
      console.log('USERS ERROR', users.error)
    }

    if(!users.error) setLoadingData(false)
    if(users.data) setAllUsers(users.data.users)
    
  }, [users])

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

  const updateHeadingSetting = (order, newValue, newColor) => {

    let updatedSettings = []
    
    if(newValue){
      updatedSettings = headingSettings.map(( item ) => {
        return item.order === order ? { ...item, content: newValue } : item
        
      })
    }

    if(newColor){
      updatedSettings = headingSettings.map(( item ) => {

        return item.order === order ? { ...item, color: newColor } : item
        
      })
    }
    
    setHeadingSettings(updatedSettings)
    setIsTyping('headings')
    
  }

  const submitAddSettings = () => {

    addSettings({ variables: { teamID: teamID, settings: headingSettings } })
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
    const newData = { ...parentObject }
    
    const fillBar = newData.fillBars.find((item, idxItem) => idxItem === idx )
    const newFillBar = { ...fillBar }

    newFillBar[type] = newText
    
    const fillBars = [...newData.fillBars]
    
    fillBars[idx] = newFillBar
    newData.fillBars = fillBars
    
    const newAllocations = allocations.map((item) => {
      return item.id === newData.id ? newData : item
    })

    setAllocations(newAllocations)
    setUpdatedFillbar(newFillBar)
    setUpdatedAllocation(newData)
    setIsTyping('fillBars')

  }

  const submitUpdateFillbar = () => {
    
    updateFillBar({ 
      variables: { allocationID: updatedAllocation.id, fillBars: updatedAllocation.fillBars, userID: dataUser.data.user.id, fillBar: updatedFillbar }
    })
    setIsTyping('')
    setSortType('')

  }

  const handleOnDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    let data = onDrop(e)

    if(!data) return 

    let foundDuplicate = []
    
    if(data.pickedContainer.fillBars){
      data.pickedContainer.fillBars.forEach((item) => {
        if(item.id == data.allocation.allocation.id) foundDuplicate.push(item)
      })
    }

    if(foundDuplicate.length > 0 ) return
    
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
    console.log(allocation)
    delete newObject.fillBars
    deleteAllocation({ variables: { allocation: newObject, userID: dataUser.data.user.id } })
    setIsTyping('')

  }

  const glowAll = (id) => {
    const elementsWithId = document.querySelectorAll(`[id="${id}"`);
    
    // Convert the NodeList to an array
    const elementsArray      = Array.from(elementsWithId);
    const listGlowOrderTwo   = document.querySelectorAll(`.glowOrderTwo`);
    const listGrowOrderThree = document.querySelectorAll(`.glowOrderThree`);
    
    const elementsWithClassName = [ ...listGlowOrderTwo, ...listGrowOrderThree]
    
    // Store the array of elements in the ref
    elementsWithIdRef.current = elementsArray;
    
    // Now, you can access the elements using elementsWithIdRef.current
    elementsWithIdRef.current.forEach(element => {
      // Do something with each element
      // console.log(element.getAttribute('data-test-id'))
      
      if(elementsWithClassName.length > 0){
        
        if(elementsWithClassName[0].id == id ){
          
        }else{

          elementsWithClassName.forEach((element) => {
            
            if(element.classList.contains('glowOrderTwo')){
              element.classList.remove("glowOrderTwo")
            }

            if(element.classList.contains('glowOrderThree')){
              element.classList.remove("glowOrderThree")
            }
 
          })
        }
      }

      if(element.getAttribute('data-test-id') == 2) {
        if(element.classList.contains('glowOrderTwo')) return element.classList.remove("glowOrderTwo")
        element.classList.add("glowOrderTwo")
      }

      if(element.getAttribute('data-test-id') == 3) {
        if(element.classList.contains('glowOrderThree')) return element.classList.remove("glowOrderThree")
        element.classList.add("glowOrderThree")
      }

    });
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
        newList = allocations
          .slice()
          .sort( (a, b) => {

          const numA = parseFloat(a[sortType]);
          const numB = parseFloat(b[sortType]);
          
          if (numA < numB) return sortTwo ? 1 : -1;
          if (numA > numB) return sortTwo ? -1 : 1;
          return 0;

        }).filter((item) => {
          if(item.order == 2) return item
        })
      }

      let newAllocations = [...allocations]
      

      newAllocations.forEach((item, index) => {
        if (item.order === 2) {
          const targetItem = newList.shift();
          newAllocations[index] = targetItem;
        }
      });

      setAllocations(newAllocations)
      setSortTwo(!sortTwo)

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
        newList = allocations
          .slice()
          .sort( (a, b) => {

          const numA = parseFloat(a[sortType]);
          const numB = parseFloat(b[sortType]);
          
          if (numA < numB) return sortThree ? 1 : -1;
          if (numA > numB) return sortThree ? -1 : 1;
          return 0

        }).filter((item) => {
          if(item.order == 3) return item
        })
      }

      let newAllocations = [...allocations]
      

      newAllocations.forEach((item, index) => {
        if (item.order === 3) {
          const targetItem = newList.shift();
          newAllocations[index] = targetItem;
        }
      });

      setAllocations(newAllocations)
      setSortThree(!sortThree)

    }
    
  }

  const submitAddAllocation = (type) => {
    
    if(type == 'two'){

      let defaultAllocationOrderTwo = {
        userID: dataUser.data.user.id,
        teamID: teamID,
        order: 2,
        fte: "1",
        text: "",
        allocation: "0"
      }

      defaultAllocationOrderTwo.color = headingSettings.length > 0 ? headingSettings[1].color : '#587B7F'
      
      addAllocation( { variables: defaultAllocationOrderTwo } ).then(() => {

        setTimeout(() => {
          scrollToBottom( containerRefLeft )
        }, 200);
        
      })
    }

    if(type == 'three'){

      let defaultAllocationOrderThree = {
        userID: dataUser.data.user.id,
        teamID: teamID,
        order: 3,
        fte: "1",
        text: "",
        allocation: "0"
      }

      defaultAllocationOrderThree.color = headingSettings.length > 0 ? headingSettings[2].color : '#587B7F'
      
      addAllocation( { variables: defaultAllocationOrderThree } ).then(() => {

        setTimeout(() => {
          scrollToBottom( containerRefRight )
        }, 200);

      })
    }
    
  }

  const scrollToBottom = (refElement) => {
    if(refElement){
      refElement.current.classList.add('smooth-scroll');
      refElement.current.scrollTop = refElement.current.scrollHeight

      setTimeout(() => {
        refElement.current.classList.remove('smooth-scroll');
      }, 500); // Adjust the delay as needed
    }
  }

  const readFile = (e, orderType) => {

    const file = e.target.files[0];

    if(file){
      ExcelRenderer(file, (err, resp) => {
        if (err) {
          console.error(err);
        } else {
          const excelData = resp.rows;

          if(excelData.length > 0){

            let array = []

            excelData.forEach( (item) => {

              const object = new Object()
              object.order        = orderType
              object.text         = item[1] ? item[1].toString() : '0'
              object.fte          = item[0] ? item[0].toString() : '0'
              object.allocation   = '0'

              array.push(object)
              
            })

            uploadAllocation( { variables: { userID: dataUser.data.user.id, teamID: teamID, allocations: array } } ).then(() => {

              if(orderType == 2){
                setTimeout(() => {
                  scrollToBottom( containerRefLeft )
                  e.target.value = ''
                }, 200);
              }
              
              if(orderType == 3){
                setTimeout(() => {
                  scrollToBottom( containerRefRight )
                  e.target.value = ''
                }, 200);  
              }

            }).catch((error) => {
              console.log(error)
            })

          }
        }
      });
    }
    
  }

  if (loadingData) return <div className="loadingPage"><span>loading</span></div>
  if (dataUser.loading) return <div className="loadingPage"><span>loading</span></div>
  if (loadingSettings) return <div className="loadingPage"><span>loading</span></div>
  if (errorSettings) return `Submission error! ${error.message}`;
  if (loadingAllocation) return <div className="loadingPage"><span>loading</span></div>
  if (errorAllocation) return `Submission error! ${errorAllocation}`;
  if (loadingUpdateAllocation) return <div className="loadingPage"><span>loading</span></div>
  if (errorUpdatedAllocation) return `Submission error! ${errorUpdatedAllocation}`;
  if (!cookies.accessToken) return <div className="loadingPage"><span>loading user data</span></div>
  if (cookies.user.role == 'systemAdmin') return <SystemAdmin allUsers={allUsers} setAllUsers={setAllUsers} removeCookie={removeCookie} currentUser={dataUser}/>
  
  return (
    <>
      <Nav
        removeCookie={removeCookie}
      >
      </Nav>
      <div className="w-full flex justify-end mt">
        <div className="teams flex justify-center items-center mt10">
        <div
          className="svgItem"
          onClick={() => setPopup('addTeam')}
        >
          <SVG 
            width={50}
            height={50}
            svg={'plus'}
            color={'#8D5A97'}
          ></SVG>
        </div>
        <div 
          className=""
        >
          { years.length > 0 && years.find(item => item.id === yearID).teams.map((team, idx) => 
            <span 
              className="teamsItem" 
              key={idx}
            >
              {team.team}
            </span>
          )}
        </div>
        </div>
      <div className="container-center wrap">
        <div className="w-full flex items-center">
          <div className="years flex items-center justify-center">
            <div 
              className="svgItem"
              onClick={() => setPopup('addYear')}
            >
              <SVG 
                width={50}
                height={50}
                svg={'plus'}
                color={'#8D5A97'}
              ></SVG>
            </div>
            { years.length > 0 && years.map((year, idx) => 
              <span 
                className="yearsItem" 
                key={idx}
                onClick={() => setYearID(year.id)}
              >
                {year.year}
              </span>
            )}
          </div>
        </div>
        <div className="container-flex-right whalf h5 border-right">
          <div 
            className="element-button-icon"
            onClick={() => (
              submitAddAllocation('two')
            )}
          >
            <SVG svg={'plus'}></SVG>
          </div>
          <div className="element-buttonFile">
            <label 
              className="curved"
              htmlFor="importAllocationOrderTwo"
            >
              import
            </label>
            <input 
              type="file"
              id="importAllocationOrderTwo"
              accept=".xlsx"
              className="element-button-text curved"
              onChange={(e) => readFile(e, 2)}
            >
            </input>
          </div>
        </div>
        <div className="container-flex-left whalf h5">
          <div 
            className="element-button-icon"
            onClick={() => 
              submitAddAllocation('three')
            }
          >
            <SVG svg={'plus'}></SVG>
          </div>
          <div className="element-buttonFile">
            <label 
              className="curved"
              htmlFor="importAllocationOrderThree"
            >
              import
            </label>
            <input 
              type="file"
              id="importAllocationOrderThree"
              accept=".xlsx"
              className="element-button-text curved"
              onChange={(e) => readFile(e, 3)}
            >
            </input>
          </div>
        </div>


        <div className="container-flex-right whalf border-right">
          <div
            style={{ backgroundColor: headingSettings.length > 0 ? headingSettings[0].color : '#254D32' }} 
            className="element-button-text curved-eased wfull"
            onMouseEnter={() => setHovered(`${headingSettings.find(( item ) =>  item.order === 1).id}`)}
            onMouseLeave={() => setHovered('')}
          >
            { headingSettings.length > 0 && isHovered == headingSettings.find(( item ) =>  item.order === 1).id &&
            <div 
              onClick={(e) => (
                setColorPallete(headingSettings.find(( item ) =>  item.order === 1).id,
                setPalleteType('headings')
              ))}
              className="elementSvgContainer positionLeftZero noColor"
            >
                <SVG svg={'pallete'}></SVG>
            </div>
            }
            <input 
              type="text"
              style={{ backgroundColor: headingSettings.length > 0 ? headingSettings[0].color : '#587B7F' }} 
              className="element-button-text curved-eased wfull fontSize-16 capitalize"
              value={ headingSettings.length > 0 ? headingSettings.find(( item ) =>  item.order === 1).content : 'Districts' }
              onChange={(e) => updateHeadingSetting(1, e.target.value) }
            >
            </input>
          </div>
          <div
            style={{ backgroundColor: headingSettings.length > 0 ? headingSettings[1].color : '#587B7F' }}  
            className="element-button-text curved-eased w20"
            onMouseEnter={() => setHovered(`${headingSettings.find(( item ) =>  item.order === 2).id}`)}
            onMouseLeave={() => setHovered('')}
          >
            { headingSettings.length > 0 && isHovered == headingSettings.find(( item ) =>  item.order === 2).id &&
            <div 
              onClick={(e) => (
                setColorPallete(headingSettings.find(( item ) =>  item.order === 2).id),
                setPalleteType('headings')
              )}
              className="elementSvgContainer positionLeftZero noColor"
            >
                <SVG svg={'pallete'}></SVG>
            </div>
            }
            <input 
              type="text"
              style={{ backgroundColor: headingSettings.length > 0 ? headingSettings[1].color : '#587B7F' }}  
              className="element-button-text curved-eased w20 fontSize-16 capitalize"
              value={ headingSettings.length > 0 ? headingSettings.find(( item ) =>  item.order === 2).content : 'Employees' }
              onChange={(e) => updateHeadingSetting(2, e.target.value) }
            >
            </input>
          </div>
          <div 
            className="element-button-icon"
          >
            <DropDown
              changeSort={changeSort}
              listType="two"
              allocations={allocations}
              setSortLeftType={setSortLeftType}
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
              setSortRightType={setSortRightType}
            >
            </DropDown>
          </div>
          <div
            style={{ backgroundColor: headingSettings.length > 0 ? headingSettings[2].color : '#587B7F' }}  
            className="element-button-text curved-eased w20"
            onMouseEnter={() => setHovered(`${headingSettings.find(( item ) =>  item.order === 3).id}`)}
            onMouseLeave={() => setHovered('')}
          >
            { headingSettings.length > 0 && isHovered == headingSettings.find(( item ) =>  item.order === 3).id &&
            <div 
              onClick={(e) => (
                setColorPallete(headingSettings.find(( item ) =>  item.order === 3).id,
                setPalleteType('headings')
              ))}
              className="elementSvgContainer positionLeftZero noColor"
            >
                <SVG svg={'pallete'}></SVG>
            </div>
            }
            <input 
              type="text"
              style={{ backgroundColor: headingSettings.length > 0 ? headingSettings[2].color : '#587B7F' }}  
              className="element-button-text curved-eased w20 fontSize-16 capitalize"
              value={ headingSettings.length > 0 ? headingSettings.find(( item ) =>  item.order === 3).content : 'Locations' }
              onChange={(e) => updateHeadingSetting(3, e.target.value) }
            >
            </input>
          </div>
          <div
            style={{ backgroundColor: headingSettings.length > 0 ? headingSettings[3].color : '#587B7F' }}  
            className="element-button-text curved-eased wfull"
            onMouseEnter={() => setHovered(`${headingSettings.find(( item ) =>  item.order === 4).id}`)}
            onMouseLeave={() => setHovered('')}
          >
            { headingSettings.length > 0 && isHovered == headingSettings.find(( item ) =>  item.order === 4).id &&
            <div 
              onClick={(e) => (
                  setColorPallete(headingSettings.find(( item ) =>  item.order === 4).id,
                  setPalleteType('headings')
              ))}
              className="elementSvgContainer positionLeftZero noColor"
            >
                <SVG svg={'pallete'}></SVG>
            </div>
            }
            <input 
              type="text"
              style={{ backgroundColor: headingSettings.length > 0 ? headingSettings[3].color : '#587B7F' }}  
              className="element-button-text curved-eased wfull fontSize-16 capitalize"
              value={ headingSettings.length > 0 ? headingSettings.find(( item ) =>  item.order === 4).content : 'Allocations' }
              onChange={(e) => updateHeadingSetting(4, e.target.value) }
            >
            </input>
          </div>
        </div>

        { colorPallete &&
          <ColorPallete
            colorPallete={colorPallete}
            setColorPallete={setColorPallete}
            headingSettings={headingSettings}
            updateHeadingSetting={updateHeadingSetting}
            palleteType={palleteType}
            setPalleteType={setPalleteType}
            updateAllocationItems={updateAllocationItems}
          >
          </ColorPallete>
        }

        <ColumnListLeft
          allocations={allocations}
          onDragOver={onDragOver}
          handleOnDrop={handleOnDrop}
          onDragStartFillBar={onDragStartFillBar}
          handleOnDropFillbar={handleOnDropFillbar}
          isHovered={isHovered}
          setHovered={setHovered}
          glowAll={glowAll}
          handleDeleteFillbar={handleDeleteFillbar}
          onDragStart={onDragStart}
          handleDeleteAllocation={handleDeleteAllocation}
          updateAllocationItems={updateAllocationItems}
          containerRefLeft={containerRefLeft}
          colorPallete={colorPallete}
          setColorPallete={setColorPallete}
          headingSettings={headingSettings}
          setPalleteType={setPalleteType}
        >
        </ColumnListLeft>

        <ColumnListRight
          allocations={allocations}
          onDragOver={onDragOver}
          handleOnDrop={handleOnDrop}
          onDragStartFillBar={onDragStartFillBar}
          handleOnDropFillbar={handleOnDropFillbar}
          isHovered={isHovered}
          setHovered={setHovered}
          glowAll={glowAll}
          handleDeleteFillbar={handleDeleteFillbar}
          onDragStart={onDragStart}
          handleDeleteAllocation={handleDeleteAllocation}
          updateAllocationItems={updateAllocationItems}
          updateFillBarData={updateFillBarData}  
          containerRefRight={containerRefRight}
          colorPallete={colorPallete}
          setColorPallete={setColorPallete}
          headingSettings={headingSettings}
          setPalleteType={setPalleteType}
        >
        </ColumnListRight>
        

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
              {parseFloat(sum(allocations, 3))}
            </div>
            <div className="elementInnerBox schemeFour">
              {parseFloat(sumByType(allocations, 'allocation', 3))}
            </div>
          </div>
        </div>

      </div>
      </div>
      { popup == 'addYear' &&
        <AddYear
          loading={loading}
          setLoading={setLoading}
          submitError={submitError}
          setSubmitError={setSubmitError}
          addYear={addYear}
          setPopup={setPopup}
          user={dataUser}
        >
        </AddYear>
      }
      { popup == 'addTeam' &&
        <AddTeam
          loading={loading}
          setLoading={setLoading}
          submitError={submitError}
          setSubmitError={setSubmitError}
          addTeam={addTeam}
          setPopup={setPopup}
          year={yearID}
        >
        </AddTeam>
      }
    </>
  )
}

export default Staffing
