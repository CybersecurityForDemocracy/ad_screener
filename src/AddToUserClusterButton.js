import React, { useState, useEffect } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from "react-bootstrap/Modal";
import axios from "axios";

import AddtoNewClusterForm from "./AddtoNewClusterForm.js";

const getUserClusterURL = "/get_user_clusters";

const AddToUserClusterButton = (params) => {
  const [userClusters, setUserClusters] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const handleCloseCreateModal = () => {setShowCreateModal(false); refresh()};
  const handleShowCreateModal = () => setShowCreateModal(true);

  const getUserClusterData = () => {
    axios
      .get(getUserClusterURL)
      .then((response) => {
        console.log(response.data);
        setUserClusters(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  };

  const refresh = () => {
    getUserClusterData();
  }

  useEffect(() => {
    getUserClusterData();
  }, []);

  const handleInsert = (ad_cluster_id) => {
    if (params.archive_ids.length !== 1) {
      if (window.confirm("Are you sure you want to add all the archive ids in this cluster to your cluster? To add select archive ids, go to the alternate creatives tab in Ad Details.")) {
        axios
          .post('/add_to_user_cluster/'+ ad_cluster_id, {"archive_ids": params.archive_ids})
          .then((response) => {
            console.log(response.data);
            alert("Ad successfully added to cluster")
          })
          .catch((error) => {
            console.log(error);
            alert("There was a problem in adding to cluster")
          })
          .finally(() => {}); 
      }
    }
    else {
      axios
        .post('/add_to_user_cluster/'+ ad_cluster_id, {"archive_ids": params.archive_ids})
        .then((response) => {
          console.log(response.data);
          alert("Ad successfully added to cluster")
        })
        .catch((error) => {
          console.log(error);
          alert("There was a problem in adding to cluster")
        })
        .finally(() => {}); 
    }
  };

  return (
    <div>
      <DropdownButton className="problematic-ad-button" title="Add to your cluster">
        {userClusters.map(
          (cluster) => (
            <Dropdown.Item
              key={cluster.ad_cluster_id}
              onClick={() => handleInsert(cluster.ad_cluster_id)}
            >
              {cluster.ad_cluster_name}
            </Dropdown.Item>
          ),
        )}
        <Dropdown.Item
          onClick={handleShowCreateModal}
        >
          Create new cluster
        </Dropdown.Item>
      </DropdownButton>
      <Modal
        show={showCreateModal}
        onHide={handleCloseCreateModal}
        >
        <Modal.Header closeButton>
          <Modal.Title>Create new cluster</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddtoNewClusterForm
            archive_ids={params.archive_ids}/>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AddToUserClusterButton