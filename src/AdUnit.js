import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Table from 'react-bootstrap/Table'
import './AdUnit.css';

const AdUnit = params => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div className ='ad-container'>
            {/* <p><b>Funding Entity:</b>    {params.ad.funding_entity}  <a href={params.ad.snapshot_url} target="_blank" rel="noopener noreferrer" >Ad Library Link</a><br/> */}
            {/* Spend: {params.ad.spend}  */}
            {/* Impressions: {params.ad.impressions} */}
            {/* </p> */}
            <Button variant="primary" onClick={handleShow}>
                Ad Details
            </Button>
            <AdDetails show={show}  handleClose={handleClose} ad={params.ad} key={params.ad.archive_id}/>
            <div className='ad-image-container'><img className='ad-image' alt={params.ad.image_bucket_path} src={"https://storage.googleapis.com/facebook_ad_images/screenshots/"+params.ad.archive_id+".png"} /></div>
        </div>
    )
}

const filterfn = (key, val) => {
    return (obj => obj[key] === val)
}

const AdDetails = params =>{
    console.log(params.ad.demo_impression_results)
    var female_data = params.ad.demo_impression_results.filter(filterfn('gender','female'))
    female_data.sort((a, b) => (a.age_group > b.age_group) ? 1 : -1)
    var male_data = params.ad.demo_impression_results.filter(filterfn('gender','male'))
    male_data.sort((a, b) => (a.age_group > b.age_group) ? 1 : -1)
    var unknown_data = params.ad.demo_impression_results.filter(filterfn('gender','unknown'))
    unknown_data.sort((a, b) => (a.age_group > b.age_group) ? 1 : -1)
    var ad_url="https://www.facebook.com/ads/library/?id=" + params.ad.archive_id
    return (
        <Modal show={params.show}
               onHide={params.handleClose} 
               dialogClassName="modal-90w"
               size="xl">
            <Modal.Header closeButton>
    <Modal.Title>Ad: {params.ad.archive_id}, Creation Date: {params.ad.creation_date}, <a href={ad_url} target="_blank" rel="noopener noreferrer" >(ad library link)</a> </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Tabs defaultActiveKey="demos">
            <Tab eventKey="demos" title="Total Demographic Spend" mountOnEnter={true}>
            <h3>Female</h3>
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>Age Group</th>
                <th>Max Spend</th>
                <th>Max Impressions</th>
                </tr>
            </thead>
            <tbody>
                {female_data.map(ad => (<tr key={ad.age_group}><td>{ad.age_group}</td><td>{ad.max_spend}</td><td>{ad.max_impressions}</td></tr>))}
            </tbody>
            </Table>
            <h3>Male</h3>
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>Age Group</th>
                <th>Max Spend</th>
                <th>Max Impressions</th>
                </tr>
            </thead>
            <tbody>
                {male_data.map(ad => (<tr key={ad.age_group}><td>{ad.age_group}</td><td>{ad.max_spend}</td><td>{ad.max_impressions}</td></tr>))}
            </tbody>
            </Table>
            <h3>Unknown</h3>
            <Table striped bordered hover>
            <thead>
                <tr>
                <th>Age Group</th>
                <th>Max Spend</th>
                <th>Max Impressions</th>
                </tr>
            </thead>
            <tbody>
                {unknown_data.map(ad => (<tr key={ad.age_group}><td>{ad.age_group}</td><td>{ad.max_spend}</td><td>{ad.max_impressions}</td></tr>))}
            </tbody>
            </Table>

            </Tab>
            <Tab eventKey="regional" title="Total Regional Spend"  mountOnEnter={true}>
               {JSON.stringify(params.ad.demo_impression_results)}
            </Tab>
            <Tab eventKey="alternates" title="Alternate Creatives" mountOnEnter={true}>
            <div className='ad-image-container'><img className='ad-image' alt={params.ad.image_bucket_path} src={"https://storage.googleapis.com/facebook_ad_images/screenshots/"+params.ad.archive_id+".png"} /></div>
            <div className='ad-image-container'><img className='ad-image' alt={params.ad.image_bucket_path} src={"https://storage.googleapis.com/facebook_ad_images/screenshots/"+params.ad.archive_id+".png"} /></div>
            <div className='ad-image-container'><img className='ad-image' alt={params.ad.image_bucket_path} src={"https://storage.googleapis.com/facebook_ad_images/screenshots/"+params.ad.archive_id+".png"} /></div>

            </Tab>
            </Tabs></Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={params.handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default AdUnit;