import React from 'react';

export default (props) => {
    const {names, highlight} = props;
 
  return (
    <div className="sidebar">
      <hr/>
      <h3>C-Ville Restaurants Currently Open</h3>
        <p>Click on a marker for more information.</p>
      <p>Use the drop-down menu to view all options (customer rating in parentheses, out of 5)</p>
      <p>Selecting a restuarant will zoom to its location on the map.</p>

        <select defaultValue="*"
        type="select"
        name="restList"
        onChange={(e) => highlight(e)}>
         {
            names.map((name, i) => {
              return (
                  <option value={name} key={i}>{name}</option>
                );
            }, this)
          }
         
      </select>
    </div>
  );
};