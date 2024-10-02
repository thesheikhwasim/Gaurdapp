import React, { useState, useEffect, useRef } from 'react';
import { IonButtons, IonLoading, IonContent, IonGrid, IonRow, IonCol, IonHeader, 
  IonLabel,IonDatetimeButton, IonDatetime, IonMenuButton, IonPage, IonTitle, IonToolbar, IonImg, IonCard, 
  IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFab, IonFabButton, IonIcon, 
  IonModal, IonButton, IonList, IonItem, IonInput, IonSelect, IonSelectOption, 
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
  useIonToast,IonSpinner, } from '@ionic/react';
import { useParams } from 'react-router';
import axios from 'axios';
import './Page.css';
import useAuth from '../hooks/useAuth'; // Import the custom hook
import { add, closeOutline } from 'ionicons/icons';
import CustomHeader from './CustomHeader';
import CustomFooter from './CustomFooter';
import { BASEURL } from '../utilities_constant';
import { t } from 'i18next';
import { useHistory } from 'react-router-dom';




const GetRequests: React.FC = () => {
  // useAuth(); // Enforce login requirement
  const history = useHistory();
  const [questionsubmitted, setquestionsubmitted] = useState<any>('');        
  const [datetimeneeded, setdatetimeneeded] = useState<any>('');
  const [datetimeendneeded, setdatetimeendneeded] = useState<any>('');
  const [datetimeendtitle, setdatetimeendtitle] = useState<any>('');
  const [otherdetailneeded, setotherdetailneeded] = useState<any>('');
  const [branchcodeneeded, setbranchcodeneeded] = useState<any>('');
  const [postquesassignid, setpostquesassignid] = useState<any>('');
  const [questitle, setquestitle] = useState<any>('');
  const [quesid, setquesid] = useState<any>('');
  const [selectoption, setselectoption] = useState<any>('YES');
  const [branchcode, setbranchcode] = useState<any>('');
  const [otherdetail, setotherdetail] = useState<any>('');
  const [otherdetailtitle, setotherdetailtitle] = useState<any>('');
  const [datetimetitle, setdatetimetitle] = useState<any>('');
  const [datetime, setdatetime] = useState<any>('');
  const [datetimeend, setdatetimeend] = useState<any>('');
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [requestData, setRequestData] = useState<any>('');
  const [totalquestion, settotalquestion] = useState<any>('');
  const [quessubmittedData, setquessubmittedData] = useState<any>('');
  const [quessubmittedDate, setquessubmittedDate] = useState<any>('');
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [priority, setPriority] = useState('LOW');
  const [reqSubject, setReqSubject] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqType, setReqType] = useState('');
  const [present, dismiss] = useIonToast();
  const [reqOtherDetail, setReqOtherDetail] = useState('');
  const modalFrom = useRef<HTMLIonModalElement>(null);
  const token = localStorage.getItem('token');
  const [reloader, setReloader] = useState(false);
  const [nocomment, setnocomment] = useState(false);
  const [nodetail, setnodetail] = useState('');
  const [showspinner, setshowspinner] = useState<boolean>(false);


  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    const url = BASEURL+"daily_post_report_question.php";
    const formData = new FormData();
    formData.append('action', "daily_post_report_ques");
    formData.append('token', token);
    formData.append('language',storedLang);
  
    
    axios.post(url, formData)
      .then(response => {
        if (response.data && response.data.success) {
          settotalquestion(response.data.employee_data.totalques);
          setRequestData(response.data.employee_data.question_data);
          setquestionsubmitted(response.data.employee_data.question_submitted);
          if(response.data.employee_data.question_submitted===true)
          {
            setquessubmittedDate(response.data.employee_data.answer_data[0].updated_on);
            setquessubmittedData(response.data.employee_data.answer_data);
          }
        
          setquesid(response.data.employee_data.question_data[0].question_master_id);
          setquestitle(response.data.employee_data.question_data[0].question_title);
           setpostquesassignid(response.data.employee_data.question_data[0].post_ques_assign_id);
          setotherdetailtitle(response.data.employee_data.question_data[0].question_other_detail_title);
          setdatetimetitle(response.data.employee_data.question_data[0].question_datetime_title);
          setbranchcodeneeded(response.data.employee_data.question_data[0].branch_code_needed);
          setdatetimeneeded(response.data.employee_data.question_data[0].question_datetime_needed);
          setdatetimeendneeded(response.data.employee_data.question_data[0].question_end_datetime_needed);
          setdatetimeendtitle(response.data.employee_data.question_data[0].question_end_datetime_title);
          setotherdetailneeded(response.data.employee_data.question_data[0].question_other_detail_text);
          
        } else {
          console.error('Failed to fetch requests:', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching requests:', error);
        setLoading(false);
      });


   


  }, []);

  const { name } = useParams<{ name: string; }>();

  function newpostreportNav() {
   
    setReqType('newpostreport');
    setShowRequestModal(true);
  }

  const fetchquestionData = async (token: string) => {
    const storedLang = localStorage.getItem('language');
    const url = BASEURL+"daily_post_report_question.php";
    const formData = new FormData();
    formData.append('action', "daily_post_report_ques");
    formData.append('token', token);
    formData.append('language',storedLang);
  
    
    axios.post(url, formData)
      .then(response => {
        if (response.data && response.data.success) {
          settotalquestion(response.data.employee_data.totalques);
          setRequestData(response.data.employee_data.question_data);
          setquestionsubmitted(response.data.employee_data.question_submitted);
          if(response.data.employee_data.question_submitted===true)
          {
            setquessubmittedDate(response.data.employee_data.answer_data[0].updated_on);
            setquessubmittedData(response.data.employee_data.answer_data);
          }
        
          setquesid(response.data.employee_data.question_data[0].question_master_id);
          setquestitle(response.data.employee_data.question_data[0].question_title);
           setpostquesassignid(response.data.employee_data.question_data[0].post_ques_assign_id);
          setotherdetailtitle(response.data.employee_data.question_data[0].question_other_detail_title);
          setdatetimetitle(response.data.employee_data.question_data[0].question_datetime_title);
          setbranchcodeneeded(response.data.employee_data.question_data[0].branch_code_needed);
          setdatetimeneeded(response.data.employee_data.question_data[0].question_datetime_needed);
          setdatetimeendneeded(response.data.employee_data.question_data[0].question_end_datetime_needed);
          setdatetimeendtitle(response.data.employee_data.question_data[0].question_end_datetime_title);
          setotherdetailneeded(response.data.employee_data.question_data[0].question_other_detail_text);
          
        } else {
          console.error('Failed to fetch requests:', response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching requests:', error);
        setLoading(false);
      });


  };

  

  const handleSubmit = (event) => {
   
    if(branchcode==='' && branchcodeneeded===1 && selectoption==='YES')
    {
     alert("Please enter Branch code");
    }
    else if(otherdetail==='' && otherdetailneeded===1 && selectoption==='YES')
      {
       alert("Please enter "+otherdetailtitle);
      }
      else if(datetime==='' && datetimeneeded===1 && selectoption==='YES')
        {
         alert("Please enter "+datetimetitle);
        }
        else if(datetimeend==='' && datetimeendneeded===1 && selectoption==='YES')
          {
           alert("Please enter "+datetimeendtitle);
          }
          else if(nodetail==='' && selectoption==='NO')
            {
             alert("Please enter comment.");
            }
    else
    {
    const url = BASEURL+"daily_post_report_answer.php";
    const formData = new FormData();
    formData.append('action', "daily_post_report_answer");
    formData.append('token', token);
    formData.append('questitle',questitle);
    formData.append('quesid',quesid);
    formData.append('selectoption',selectoption);
    formData.append('nodetail',nodetail);
    formData.append('branchcode',branchcode);
    formData.append('otherdetail',otherdetail);
    formData.append('otherdetailtitle',otherdetailtitle);
    formData.append('datetimetitle',datetimetitle);
    formData.append('datetime',datetime);
    formData.append('datetimeendtitle',datetimeendtitle);
    formData.append('datetimeend',datetimeend);
    formData.append('postquesassignid',postquesassignid);
    setshowspinner(true);
    axios.post(url, formData)
    .then(response => {
      if (response.data && response.data.success) {
        setquestitle('');
        setquesid('');
        setselectoption('');
        setbranchcode('');
        setotherdetail('');
        setotherdetailtitle('');
        setdatetimetitle('');
        setdatetime('');
        setdatetimeend('');
        setpostquesassignid('');
        setshowspinner(false);
        window.location.reload();
      
      } else {
        console.error('Failed to fetch requests:', response.data);
      }
      setLoading(false);
    })
    .catch(error => {
      console.error('Error fetching requests:', error);
      setLoading(false);
    });

    console.log('Form Data:');
    }
  };


  function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    //Function that hits when ion pull to refresh is called
    setTimeout(() => {
      //fetchquestionData(localStorage.getItem('token'));
      handleSubmit;
      setReloader(!reloader);
      event.detail.complete();
    }, 500);
  }

  const getoption = (newoption: string) => {
    setselectoption(newoption);
    if(newoption==='NO')
    {
      setnocomment(true);
      
    }
    else
    {
      setnocomment(false);   
    }
  
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <CustomHeader />
      
           <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
        {loading ? (
          <IonLoading isOpen={loading} message={'Loading...'} />
        ) : (
          <>
            <div className="header_title">
              <IonTitle className="header_title ion-text-center">{t('Submit Your Daily Post Report')}</IonTitle>
            </div>
            <IonCard className='shift-details-card-content'>
              {(requestData && requestData.length > 0) ? (
               
                <IonGrid>
                  {requestData.map((ticket, index) => (
                   <div className="content"   key={index} style={{ width: '100%' }}>
                    <IonCard  className="shift-details-card">
                    <IonCardHeader  class="ion-text-center">
  <IonCardTitle >  <strong>Question number of: {totalquestion-(ticket.quesnum-1)} out of {totalquestion}</strong>  </IonCardTitle>
</IonCardHeader>
                      <div className="shift-details-column">

                      <IonItem>{ticket.question_title || 'N/A'}
                    {/*  <IonInput tyle="hidden" name="questitle"  readonly={true} value={ticket.question_title || 'N/A'}
                     onIonChange={(questitle) => {
                     setquestitle(questitle);
                      
                    }} ></IonInput>*/}
                      </IonItem>
                     
                 
                      {ticket.question_type === 'OPTIONS' ? (
          <IonItem>
           <IonLabel position="floating">{t('Select')}</IonLabel>

     
           <IonSelect name="selectoption[{index}]" value={selectoption} onIonChange={e => getoption(e.detail.value)} >
             <IonSelectOption defaultValue="true" value={ticket.question_options.split(',')[0]}>{ticket.question_options.split(',')[0]}</IonSelectOption>
             <IonSelectOption value={ticket.question_options.split(',')[1]}>{ticket.question_options.split(',')[1]}</IonSelectOption>
               </IonSelect></IonItem>
         
              ) : ticket.question_type === 'TEXT' ? (
                <p></p>
              ) : null}
              {nocomment ?  ( <IonItem>
                      <IonLabel position="floating">{t('Enter Comment')}</IonLabel>
                      <IonInput required={true} name="nocomment"  value={nodetail} onIonInput={e => setnodetail(e.detail.value!)} ></IonInput>
                    </IonItem>
                      ) : null}
               {ticket.branch_code_needed ===1 && !nocomment ? (
                      <IonItem>
                      <IonLabel position="floating">{t('Enter Branch Code')}</IonLabel>
                      <IonInput required={true} name="branchcode"  value={branchcode} onIonInput={e => setbranchcode(e.detail.value!)} ></IonInput>
                    </IonItem>
                      ) : null}
 {ticket.question_other_detail_text ===1 && !nocomment ? (
<IonItem>
  <IonLabel position="floating"> <IonInput name="otherdetailtitle"  readonly={true} value={ticket.question_other_detail_title} onIonInput={e => setquestitle(e.detail.value!)} ></IonInput>  
</IonLabel>
  <IonInput name="otherdetail" value={otherdetail} onIonChange={e => setotherdetail(e.detail.value!)}></IonInput>
</IonItem>
                      ) : null}

{ticket.question_datetime_needed ===1 && !nocomment ? (
         
<IonItem>
  <IonLabel position="floating"> <IonInput name="datetimetitle"  readonly={true} value={ticket.question_datetime_title} onIonInput={e => setquestitle(e.detail.value!)} ></IonInput>  
</IonLabel>
<br></br><br></br>
<>
<IonDatetimeButton datetime="datetime"></IonDatetimeButton>
<IonModal keepContentsMounted={true}>
        <IonDatetime id="datetime"
          onIonChange={(dataTo) => {
            let dateFormat = dataTo?.detail?.value;
            setdatetime(dateFormat);
            
          }}
        ></IonDatetime>
      </IonModal>

              
                  </>


</IonItem>
  ) : null}
{ticket.question_end_datetime_needed ===1 && !nocomment ? (
         
         <IonItem>
           <IonLabel position="floating"> <IonInput name="datetimetitle"  readonly={true} value={ticket.question_end_datetime_title} onIonInput={e => setquestitle(e.detail.value!)} ></IonInput>  
         </IonLabel>
         <br></br><br></br>
         <>
         <IonDatetimeButton datetime="datetimeend"></IonDatetimeButton>
         <IonModal keepContentsMounted={true}>
                 <IonDatetime id="datetimeend"
                   onIonChange={(dataTo) => {
                     let dateFormatend = dataTo?.detail?.value;
                     setdatetimeend(dateFormatend);
                     
                   }}
                 ></IonDatetime>
               </IonModal>
         
                       
                           </>
         
         
         </IonItem>
           ) : null}
         


 </div>
                   
<p className='daily-report-submit'>
{showspinner ? (
         <IonItem > <IonSpinner name="lines"></IonSpinner></IonItem>
        ) : ('')}
  <IonButton disabled={showspinner} className="ion-margin-top" type="button" onClick={handleSubmit} expand="block">
    {t('Submit')}
  </IonButton></p>
  
                    </IonCard>
                    </div>
                  ))}
            
                </IonGrid>
              
              ) : (
               [ quessubmittedData && quessubmittedData.length===totalquestion ?
                <p className='daily-report-submit'> {t('Today`s Report Already Submitted')}</p>
                : <p className='daily-report-submit'>  {t('No Report found')}</p>
                  ]
              )}
            </IonCard>

          

<div className="content">
<IonCard className="shift-details-card">
{(questionsubmitted ) ? (<IonCardHeader  class="ion-text-center">
  <IonCardTitle ><strong>Site ID: {quessubmittedData[0].site_id} {quessubmittedData[0].duty_shift} Shift {t('Post Report')} On {quessubmittedDate.split(' ')[0]}</strong></IonCardTitle>
</IonCardHeader>) : null}
            <IonCard className='shift-details-card-content'>
              {(quessubmittedData && quessubmittedData.length > 0) ? (
               
                <IonGrid>
                  {quessubmittedData.map((ticket, index) => (
                      <IonCard className="card" key={index} style={{ width: '100%' }}>
                      <div className="shift-details-column">
                        <p><strong>{index+1}): {ticket.question_title}</strong> {ticket.question_option}</p>
                    {ticket.question_option==='NO' &&
                    <p><strong>{t('Comment')}</strong> {ticket.option_comment}</p>
                    }


                        {ticket.branch_code !='' && ticket.question_option==='YES' &&
               <p><strong>{t('Branch Code')}</strong> {ticket.branch_code}</p>
             }
                      {ticket.question_other_detail_title !='' && ticket.question_option==='YES' &&
               <p><strong>{ticket.question_other_detail_title}</strong> {ticket.question_other_detail_value}</p>
             }
                        {ticket.question_datetime_title !='' && ticket.question_option==='YES' &&
               <p><strong>{ticket.question_datetime_title}</strong> {ticket.question_datetime_value.split('T')[0]} {ticket.question_datetime_value.split('T')[1]}</p>
             }
                          {ticket.question_end_datetime_title !='' && ticket.question_option==='YES' &&
               <p><strong>{ticket.question_end_datetime_title}</strong> {ticket.question_end_datetime_value.split('T')[0]} {ticket.question_end_datetime_value.split('T')[1]}</p>
             }
                      </div>
                    </IonCard>
                    
                  ))}
            
                </IonGrid>
              
              ) : (
                <IonLabel><div className='notFound'>
                  <IonImg src="./assets/imgs/nodata.svg" alt="header" />
                  No Report Submitted</div></IonLabel>
              )}
            </IonCard>
            </IonCard>
            </div>
            <div className='footer'>
            <CustomFooter />
            </div>
          </>
        )}
   
  
      </IonContent>
    </IonPage>
  );
};

export default GetRequests;


