import React from 'react';
import { Link } from "react-router-dom";
import { hash, age } from 'common/helpers/transactions';
import cx from 'classnames';
import map from 'lodash/map';
import truncate from 'lodash/truncate';

const NUM_TRANSACTIONS = 30;

const TokenTxsTable = ({ transactions, type, className }) => {

  return (
    <table className={cx("data txn-table", className)}>
      <thead>
        <tr>
          <th className="hash">Txn Hash</th>
          <th className="age">Age</th>
          <th className="from">From</th>
          <th className="to">To</th>
          {type === 'TNT-721' && <th className="tokenId">TokenId</th>}
          {type === 'TNT-20' && <th className="Quantity">Quantity</th>}
        </tr>
      </thead>
      <tbody>
        {map(transactions, (txn, i) => {
          return (
            <tr key={i}>
              <td className="hash overflow"><Link to={`/txs/${txn.hash}`}>{hash(txn, 30)}</Link></td>
              <React.Fragment>
                <td className="age">{age(txn)}</td>
                <td className="from">
                  <Link to={`/account/${txn.from}`}>{truncate(txn.from, { length: NUM_TRANSACTIONS })}</Link>
                </td>
                <td className="to">
                  <Link to={`/account/${txn.to}`}>{truncate(txn.to, { length: NUM_TRANSACTIONS })}</Link>
                </td>
                {type === 'TNT-721' && <td className="tokenId">
                  <Link to={`/token/${txn.contract_address}?a=${txn.token_id}`}>{txn.token_id}</Link>
                </td>}
                {type === 'TNT-20' && <td className="quantity">{txn.value}</td>}
              </React.Fragment>
            </tr>);
        })}
      </tbody>
    </table>
  );
}

export default TokenTxsTable;