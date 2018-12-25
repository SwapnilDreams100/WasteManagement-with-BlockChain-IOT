pragma solidity ^0.4.6;

contract IOTDev {
    address private creator;

    struct device_data {
        uint index;
        uint[] timestamps;
        mapping(uint => string) filehashes;
    }
    mapping(address => device_data) private device_logs;
    address[] private device_index;
    event log_action (address indexed device_id, uint index, uint timestamp, string filehash);

    function is_device_present (address device_id) public constant returns (bool result) {
        if(device_index.length == 0) return false;
        return (device_index[device_logs[device_id].index] == device_id);
    }

    function filehash_concat (string h1, string h2) internal constant returns (string concat) {
        bytes memory b1 = bytes(h1);
        bytes memory b2 = bytes(h2);
        string memory sm = new string(b1.length + 1 + b2.length);
        bytes memory bm = bytes(sm);
        uint i = 0;
        uint k = 0;
        for (i = 0; i < b1.length; i++) bm[k++] = b1[i];
        bm[k++] = ',';
        for (i = 0; i < b2.length; i++) bm[k++] = b2[i];
        return string(sm);
    }

    function set_device_data (address device_id, string filehash) public returns (uint index, uint timestamp) {
        uint ts;
        if(is_device_present(device_id)) {
            ts = now;
            if( device_logs[device_id].timestamps.length == 0 ||
                device_logs[device_id].timestamps[device_logs[device_id].timestamps.length-1] < ts) {
                device_logs[device_id].timestamps.push(ts);
                device_logs[device_id].filehashes[ts] = filehash;
            } else if(device_logs[device_id].timestamps[device_logs[device_id].timestamps.length-1] == ts) {
                device_logs[device_id].filehashes[ts] = filehash_concat(device_logs[device_id].filehashes[ts], filehash);
            } else {
                assert(false);
            }
            log_action(device_id, device_logs[device_id].index, ts, filehash);
            return(device_logs[device_id].index, ts);
        } else {
            ts = now;
            device_logs[device_id].timestamps.push(ts);
            device_logs[device_id].filehashes[ts] = filehash;
            device_logs[device_id].index = device_index.push(device_id)-1;
            log_action(device_id, device_index.length-1, ts, filehash);
            return(device_index.length-1, ts);
        }
    }

    function get_device_data (address device_id, uint timestamp) public constant returns (string hash) {
        if(!is_device_present(device_id)) revert();
        return device_logs[device_id].filehashes[timestamp];
    }

    function get_device_timestamps (address device_id) public constant returns (uint[] timestamp) {
        if(!is_device_present(device_id)) revert();
        return device_logs[device_id].timestamps;
    }

    function get_device_count() public constant returns (uint count) {
        return device_index.length;
    }

    function get_device_at_index (uint index) public constant returns (address device_address) {
        return device_index[index];
    }

    function iotdev() {
        creator = msg.sender;
    }

    function kill() {
        if (msg.sender == creator) {
            selfdestruct(creator);
        }
    }
}
