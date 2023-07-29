import React, { useEffect, useState } from "react";
import {
  GetAllOrganisationsofADonor,
  GetAllOrganisationsofAHospital,
} from "../../../apicalls/users";
import { SetLoading } from "../../../redux/loadersSlice";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Table, message } from "antd";
import { getDateFormat } from "../../../utils/helpers";
import InventoryTable from "../../../components/InventoryTable";

function Organisations({ userType }) {
  const [showHistoryModal, setShowHistoryModal] = useState();
  const { currentUser } = useSelector((state) => state.users);
  const [selectedOrganisation, setSelectedOrganisation] = useState(null);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      let response = null;
      if (userType === "hospital") {
        response = await GetAllOrganisationsofAHospital();
      } else {
        response = await GetAllOrganisationsofADonor();
      }
      dispatch(SetLoading(false));
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "organisationName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => getDateFormat(text),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <span
          className="underline text-md cursor-pointer"
          onClick={() => {
            setSelectedOrganisation(record);
            setShowHistoryModal(true);
          }}
        >
          History
        </span>
      ),
    },
  ];
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <Table columns={columns} dataSource={data} />
      {showHistoryModal && (
        <Modal
          title={`${
            userType === "donor" ? "Donations History" : "Consumption History"
          } In ${selectedOrganisation.organisationName}`}
          centered
          open={showHistoryModal}
          onCancel={() => setShowHistoryModal(false)}
          width={1000}
        >
          <InventoryTable
            filters={{
              organisation: selectedOrganisation._id,
              [userType]: currentUser._id,
            }}
          />
          ,
        </Modal>
      )}
    </div>
  );
}

export default Organisations;
