import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { formatRupiah } from "./utils/formatRupiah";

const customStyles = {
  control: (base) => ({
    ...base,
    padding: "0.375rem 0.75rem",
    borderRadius: "0.75rem",
    borderColor: "#d1d5db",
    color: "black",
    "&:hover": { borderColor: "#9ca3af" },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "0.75rem",
    zIndex: 10,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#2563eb" 
      : state.isFocused
      ? "#e0f2fe" 
      : "white",
    color: state.isSelected ? "white" : "#1e293b", 
    padding: "10px 15px",
    fontWeight: state.isSelected ? "600" : "400",
    cursor: "pointer",
    borderBottom: "1px solid #f1f5f9", 
  }),
};

export default function App() {
  const [negaraList, setNegaraList] = useState([]);
  const [pelabuhanList, setPelabuhanList] = useState([]);
  const [barangList, setBarangList] = useState([]);

  const [selectedNegara, setSelectedNegara] = useState(null);
  const [selectedPelabuhan, setSelectedPelabuhan] = useState(null);
  const [selectedBarang, setSelectedBarang] = useState(null);

  const [harga, setHarga] = useState("");
  const [diskon, setDiskon] = useState("");
  const [total, setTotal] = useState("");
  const [deskripsi, setDeskripsi] = useState("");

  useEffect(() => {
    axios
      .get("http://202.157.176.100:3001/negaras")
      .then((res) => setNegaraList(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedNegara) {
      axios
        .get(
          `http://202.157.176.100:3001/pelabuhans?filter={"where":{"id_negara":${selectedNegara.id_negara}}}`
        )
        .then((res) => setPelabuhanList(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedNegara]);

  useEffect(() => {
    if (selectedPelabuhan) {
      axios
        .get(
          `http://202.157.176.100:3001/barangs?filter={"where":{"id_pelabuhan":${selectedPelabuhan.id_pelabuhan}}}`
        )
        .then((res) => setBarangList(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedPelabuhan]);

  useEffect(() => {
    if (selectedBarang) {
      setHarga(selectedBarang.harga);
      setDiskon(selectedBarang.diskon);
      setDeskripsi(selectedBarang.description);
    }
  }, [selectedBarang]);

  useEffect(() => {
    const h = parseFloat(harga) || 0;
    const d = parseFloat(diskon) || 0;
    const t = h - (h * d) / 100;
    setTotal(t);
  }, [harga, diskon]);

  return (
    <div className="bg-cargo min-h-screen min-w-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-5 w-1/2">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Negara
          </label>
          <Select
            styles={customStyles}
            options={negaraList.map((n) => ({
              value: n.id,
              label: n.nama_negara,
              ...n,
            }))}
            onChange={(opt) => {
              setSelectedNegara(opt);
              setSelectedPelabuhan(null);
              setSelectedBarang(null);
              setBarangList([]);
              setHarga("");
              setDiskon("");
              setTotal("");
              setDeskripsi("");
            }}
            placeholder="Pilih Negara"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pelabuhan
          </label>
          <Select
            styles={customStyles}
            options={pelabuhanList.map((p) => ({
              value: p.id,
              label: p.nama_pelabuhan,
              ...p,
            }))}
            onChange={(opt) => {
              setSelectedPelabuhan(opt);
              setSelectedBarang(null);
              setHarga("");
              setDiskon("");
              setTotal("");
              setDeskripsi("");
            }}
            placeholder="Pilih Pelabuhan"
            isDisabled={!selectedNegara}
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Barang
          </label>
          <Select
            styles={customStyles}
            options={barangList.map((b) => ({
              value: b.id,
              label: b.nama_barang,
              ...b,
            }))}
            onChange={(opt) => {
              setSelectedBarang(opt);
            }}
            placeholder="Pilih Barang"
            isDisabled={!selectedPelabuhan}
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi
          </label>
          <textarea
            type="text"
            className="test bg-gray-100 text-gray-700"
            value={deskripsi}
            disabled
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Harga
          </label>
          <input
            type="number"
            className="test"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            disabled={selectedBarang ? false : true}
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Diskon (%)
          </label>
          <input
            type="number"
            className="test"
            value={diskon}
            onChange={(e) => setDiskon(e.target.value)}
            disabled={selectedBarang ? false : true}
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total
          </label>
          <input
            type="text"
            className="test bg-gray-100 text-gray-700"
            value={formatRupiah(total)}
            disabled
          />
        </div>
      </div>
      <div className="w-1/2 m-auto">
        <h1 className="text-2xl font-bold text-gray-200 mb-6 text-center">
          Form <br />
          Pengiriman Barang
        </h1>
      </div>
    </div>
  );
}
