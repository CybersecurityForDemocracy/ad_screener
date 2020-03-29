import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const AdUnit = params => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <li style={{ background: '#ffffff', margin: '.5em', padding: '.5em' }}>
            <h1>{params.ad.funding_entity}</h1>
            <img alt={params.ad.image_bucket_path} src={params.ad.image_bucket_path} style={{ width: '80%' }} />
            <p>Spend: {params.ad.spend}</p>
            <p>Impressions: {params.ad.impressions}</p>
            <a href={params.ad.snapshot_url}>Ad Library Link</a>
            <Button variant="primary" onClick={handleShow}>
                Ad Details
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ad Spend</Modal.Title>
                </Modal.Header>
                <Modal.Body>{JSON.stringify(params.ad.demo_impression_results)}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
          </Button>
                </Modal.Footer>
            </Modal>

        </li>
    )
}

export default AdUnit;