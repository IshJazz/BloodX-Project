import React, { useEffect, useState } from "react";
import { GetInventoryWithFilters } from "../apicalls/inventory";
import { useDispatch } from "react-redux";
import { getDateFormat } from "../utils/helpers";
import { SetLoading } from "../redux/loadersSlice";
import { Table, message } from "antd";

function InventoryTable({ filters, userType, limit }) {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const columns = [
    {
      title: "Inventory Type",
      dataIndex: "inventoryType",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (text) => text + " ML",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      render: (text, record) => {
        if (userType === "organisation") {
          return record.inventoryType === "in"
            ? record.donor?.name
            : record.hospital?.hospitalName;
        } else {
          return record.organisation.organisationName;
        }
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => getDateFormat(text),
    },
  ];
  //change columns for hospital
  if (userType !== "organisation") {
    columns.splice(0, 1);
    //change ref col to org name
    columns[2].title = "Organisation Name";
    //date column renamed taken on
    columns[3].title = userType === "hospital" ? "Consumed On" : "Donated On";
  }
  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetInventoryWithFilters(filters, limit);
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
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <Table columns={columns} dataSource={data} className="mt-3" />
    </div>
  );
}

export default InventoryTable;
