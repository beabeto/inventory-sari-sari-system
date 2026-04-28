import { useState } from "react";
import { login } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.title}>Sari-sari Store</h1>
        <p style={styles.subtitle}>
          Manage your products, inventory, and sales easily
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>

          <input
            placeholder="Username"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>

        </form>

        <p style={styles.linkText}>
          No account yet? <Link to="/register">Register</Link>
        </p>

      </div>

    </div>
  );
}

const styles:{[key:string]:React.CSSProperties} = {

container:{
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  height:"100vh",
  width:"100vw",
  background:"#f4f6f9"
},

card:{
  width:"450px",
  padding:"50px",
  background:"white",
  borderRadius:"12px",
  boxShadow:"0 10px 30px rgba(0,0,0,0.15)",
  textAlign:"center"
},

title:{
  fontSize:"32px",
  marginBottom:"10px",
  color: "black",
},

subtitle:{
  color:"#666",
  marginBottom:"30px"
},

form:{
  display:"flex",
  flexDirection:"column",
  gap:"15px"
},

input:{
  padding:"14px",
  fontSize:"16px",
  borderRadius:"6px",
  border:"1px solid #ccc",
  backgroundColor:"white",
  color: 'black',
},

button:{
  padding:"14px",
  background:"#007bff",
  color:"white",
  border:"none",
  borderRadius:"6px",
  fontSize:"16px",
  fontWeight:"bold",
  cursor:"pointer"
},

linkText:{
  marginTop:"20px",
  color:"#475569"
}

};
