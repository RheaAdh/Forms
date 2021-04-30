import React from "react";
interface props {
    form: any;
}

const ResponseCard: React.FC<props> = ({ form }) => {

    return (
        <div>
          <div style={{ backgroundColor: form.color_theme, margin:30 }}>
            <h2>
              {form.title}
            </h2>
            <p>Start time:</p>
            <p>End time:</p>
            <p>Number of responses:</p>
            <button>View Responses</button>
          </div>
        </div>
      );

}

export default ResponseCard;