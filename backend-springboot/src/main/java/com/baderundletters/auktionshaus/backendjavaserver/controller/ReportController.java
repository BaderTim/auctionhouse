package com.baderundletters.auktionshaus.backendjavaserver.controller;

import com.baderundletters.auktionshaus.backendjavaserver.database.Query;
import com.baderundletters.auktionshaus.backendjavaserver.database.SQLConnector;
import com.baderundletters.auktionshaus.backendjavaserver.error.InvalidArgumentsException;
import com.baderundletters.auktionshaus.backendjavaserver.object.*;
import com.baderundletters.auktionshaus.backendjavaserver.object.wrapper.MailWrapper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;

@RestController
@RequestMapping(value="/report")
public class ReportController {

    // Report user
    @PostMapping(path ="/", consumes = "application/json", produces = "application/json")
    public ResponseEntity report_user(@RequestHeader String sessionKey, @RequestBody MailWrapper mailWrapper) {
        SessionKey sk = new SessionKey(sessionKey);
        LightUserDto culprit = new LightUserDto(mailWrapper.getIdDto().getId());
        culprit.report(new MailDto(mailWrapper.getMailDto(), sk));
        return ResponseEntity.ok().build();
    }

    // View reports
    @PostMapping(path ="/get", consumes = "application/json", produces = "application/json")
    public ReportDto[] reports(@RequestHeader("session_key") String session_key, @RequestBody FilterDto filterDto) {
        SessionKey admin_sk = new SessionKey(session_key);
        admin_sk.admin_verify();
        FilterDto filter = new FilterDto(filterDto);
        JSONArray arr = SQLConnector.sql_get(Query.filter_reports(filter));
        ReportDto[] reports = new ReportDto[arr.length()];
        for(int r = 0; r < arr.length(); r++) {
            JSONObject obj = arr.getJSONObject(r);
            reports[r] = new ReportDto(obj.getInt("user_id"), obj.getInt("reported_user_id"), obj.getString("problem"), obj.getString("description"), ((Timestamp)obj.get("unix_time")).getTime());
        }
        return reports;
    }

    // View report by id
    @PostMapping(path ="/get/id", consumes = "application/json", produces = "application/json")
    public ReportDto report(@RequestHeader("session_key") String session_key, @RequestBody IDDto idDto) {
        SessionKey admin_sk = new SessionKey(session_key);
        admin_sk.admin_verify();
        JSONArray arr = SQLConnector.sql_get(Query.get_report_by_id(idDto.getId()));
        if(arr.length() == 0) {
            throw new InvalidArgumentsException("Could not find any reports with this id.");
        }
        JSONObject obj = arr.getJSONObject(0);
        return new ReportDto(obj.getInt("user_id"), obj.getInt("reported_user_id"), obj.getString("problem"), obj.getString("description"), ((Timestamp)obj.get("unix_time")).getTime());
    }

}
