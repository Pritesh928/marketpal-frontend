import React from "react";

export default function UnderConstruction() {
  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:Segoe UI,Arial,sans-serif;
        }

        body{
          background:#f6f6f6;
          color:#333;
        }

        .container{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          padding:40px 20px;
        }

        .content{
          max-width:700px;
          text-align:center;
        }

        img{
          width:100%;
          max-width:380px;
          margin-bottom:35px;
          animation: float 4s ease-in-out infinite;
        }

        h1{
          color:#222;
          margin-bottom:18px;
          font-size:38px;
          font-weight:700;
        }

        p{
          font-size:17px;
          line-height:1.8;
          color:#666;
          margin-bottom:15px;
        }

        .line{
          width:70px;
          height:3px;
          background:#f39c12;
          margin:30px auto;
          border-radius:10px;
        }

        .footer{
          margin-top:35px;
          color:#888;
          font-size:15px;
        }

        @media(max-width:768px){
          p{
            font-size:16px;
          }
        }
      }
      `}</style>

      <div className="container">
        <div className="content">
          <img
            src="/undraw_under-construction_c2y1.svg"
            alt="Under Construction"
          />

          <h1>Website Under Development</h1>

          <div className="line"></div>

          <p>
            We are currently updating and improving our website to provide a
            better experience for everyone.
          </p>

          <p>
            During this time, some pages and services may be temporarily
            unavailable. We apologize for any inconvenience and appreciate your
            patience while we complete the work.
          </p>

          <div className="footer">
            Thank you for your understanding.<br />
            We'll be back online soon :)
          </div>

        </div>
      </div>
    </>
  );
}