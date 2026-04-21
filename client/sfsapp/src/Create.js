import { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Create() {
  const rRno   = useRef();
  const rName  = useRef();
  const rMarks = useRef();
  const rFile  = useRef();

  const [rno,   setRno]   = useState("");
  const [name,  setName]  = useState("");
  const [marks, setMarks] = useState("");
  const [file,  setFile]  = useState("");
  const [msg,   setMsg]   = useState("");
  const [saving, setSaving] = useState(false);

  const save = (event) => {
    event.preventDefault();

    if (!rno.toString().trim()) {
      toast.error("Roll No is required");
      rRno.current.focus();
      return;
    }
    if (!name.trim()) {
      toast.error("Student name is required");
      rName.current.focus();
      return;
    }
    if (!marks.toString().trim()) {
      toast.error("Marks are required");
      rMarks.current.focus();
      return;
    }
    if (!file) {
      toast.error("Please select a file / photo");
      rFile.current.focus();
      return;
    }

    setSaving(true);
    const fd = new FormData();
    fd.append("rno",   rno);
    fd.append("name",  name);
    fd.append("marks", marks);
    fd.append("file",  file);

    axios
      .post("http://localhost:9000/ss", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setSaving(false);
        if (res.data.affectedRows === 1) {
          setMsg("success");
          toast.success("Student added successfully!");
          setRno(""); setName(""); setMarks(""); setFile("");
          if (rFile.current) rFile.current.value = "";
          rRno.current.focus();
        } else if (res.data.errno === 1062) {
          setMsg("error");
          toast.error(`Roll No ${rno} already exists`);
          setRno("");
          rRno.current.focus();
        }
      })
      .catch((err) => {
        setSaving(false);
        setMsg("error");
        toast.error("Server error: " + err.message);
      });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="sms-page">
        <div className="sms-card">

          {/* Header */}
          <div className="sms-card-header">
            <div className="sms-card-icon">🎓</div>
            <h1>Add Student</h1>
          </div>

          <form onSubmit={save} noValidate>

            <div className="sms-field">
              <label htmlFor="inp-rno">Roll Number</label>
              <input
                id="inp-rno"
                type="number"
                placeholder="e.g. 101"
                ref={rRno}
                value={rno}
                onChange={(e) => setRno(e.target.value)}
                min="1"
              />
            </div>

            <div className="sms-field">
              <label htmlFor="inp-name">Full Name</label>
              <input
                id="inp-name"
                type="text"
                placeholder="e.g. John Smith"
                ref={rName}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="sms-field">
              <label htmlFor="inp-marks">Marks</label>
              <input
                id="inp-marks"
                type="number"
                placeholder="e.g. 85"
                ref={rMarks}
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                min="0"
                max="100"
              />
            </div>

            <div className="sms-field">
              <label htmlFor="inp-file">Photo / File</label>
              <input
                id="inp-file"
                type="file"
                ref={rFile}
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*,.pdf,.doc,.docx"
              />
            </div>

            <input
              type="submit"
              value={saving ? "Saving…" : "Add Student"}
              disabled={saving}
              style={saving ? { opacity: 0.7, cursor: "not-allowed" } : {}}
            />
          </form>

          {msg === "success" && (
            <div className="sms-msg success">✅ Student record created!</div>
          )}
          {msg === "error" && (
            <div className="sms-msg error">❌ Could not create record.</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Create;