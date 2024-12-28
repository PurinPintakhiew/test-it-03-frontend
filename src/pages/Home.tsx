import { useState } from "react";
import { Modal } from "../components/Modal";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchItems, updateItem } from "../reducers/itemSlice";
import { RootState, AppDispatch } from "../store";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items }: any = useSelector((state: RootState) => state.items);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [approve, setApprove] = useState(true);
  const [reason, setReason] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleApprove = () => {
    if (selected.length > 0) {
      setModalContent("ยืนยันการอนุมัติ");
      setReason("");
      setApprove(true);
      setShowModal(true);
    } else {
      Swal.fire({
        title: "กรุณาเลือกรายการ",
        icon: "error",
      });
    }
  };

  const handleNotApproved = () => {
    if (selected.length > 0) {
      setModalContent("ยืนยันการไม่อนุมัติ");
      setReason("");
      setApprove(false);
      setShowModal(true);
    } else {
      Swal.fire({
        title: "กรุณาเลือกรายการ",
        icon: "error",
      });
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelected([]);
    } else {
      const selectableIds = items
        .filter((item: any) => item.status === "รออนุมัติ")
        .map((item: any) => item._id);
      setSelected(selectableIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((itemId) => itemId !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const onSubmit = () => {
    if (!reason.trim()) {
      Swal.fire({
        title: "กรุณากรอกเหตุผล",
        icon: "error",
      });
      return;
    }

    setShowModal(false);

    const updateData = {
      ids: selected,
      reason: reason,
      status: approve ? "อนุมัติ" : "ไม่อนุมัติ",
    };

    dispatch(updateItem(updateData))
      .unwrap()
      .then(() => {
        dispatch(fetchItems());
        setSelected([]);
        setSelectAll(false);
        Swal.fire({
          title: "อัพเดตสำเร็จ",
          icon: "success",
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "เกิดข้อผิดพลาด",
          text: error,
          icon: "error",
        });
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full text-center bg-green-600 text-white font-bold text-xl py-4 shadow-md">
        ระบบจัดการอนุมัติ
      </div>

      <div className="p-4 xl:px-[12rem]">
        <div className="flex justify-start mt-4 gap-4">
          <button
            type="button"
            className="bg-green-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-600 transition"
            onClick={handleApprove}
          >
            อนุมัติ
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-red-600 transition"
            onClick={handleNotApproved}
          >
            ไม่อนุมัติ
          </button>
        </div>

        <div className="overflow-x-auto mt-6">
          <table className="w-full bg-white shadow-md rounded-lg">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="text-center py-3 px-4 border">
                  <input
                    type="checkbox"
                    className="w-6 h-6 cursor-pointer"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="text-center py-3 px-4 border">รายการ</th>
                <th className="text-center py-3 px-4 border">เหตุผล</th>
                <th className="text-center py-3 px-4 border">สถานะเอกสาร</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item: any) => (
                  <tr key={item._id} className="hover:bg-gray-100 transition">
                    <td className="text-center py-3 px-4 border">
                      <input
                        type="checkbox"
                        disabled={item.status !== "รออนุมัติ"}
                        className="w-6 h-6 cursor-pointer"
                        checked={selected.includes(item._id)}
                        onChange={() => handleSelect(item._id)}
                      />
                    </td>
                    <td className="text-center py-3 px-4 border">
                      {item.name}
                    </td>
                    <td className="text-center py-3 px-4 border">
                      {item.reason}
                    </td>
                    <td
                      className={`text-center py-3 px-4 border font-semibold ${
                        item.status === "อนุมัติ"
                          ? "text-green-600"
                          : item.status === "ไม่อนุมัติ"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {item.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    ไม่มีข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalContent}
      >
        <div>
          <div className="felx flex-col">
            <div className="font-bold">เหตุผล :</div>
            <textarea
              className="w-full border-2"
              rows={5}
              defaultValue={reason}
              onChange={(e: any) => {
                setReason(e.target.value);
              }}
            ></textarea>
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={() => onSubmit()}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              {approve ? "อนุมัติ" : "ไม่อนุมัติ"}
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
