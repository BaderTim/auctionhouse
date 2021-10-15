package com.baderundletters.auktionshaus.backendjavaserver.object;

public class ReportDto {
    private int author_user_id;
    private int culprit_user_id;
    private String problem;
    private String description;
    private long unix_time;

    public ReportDto(int author_user_id, int culprit_user_id, String problem, String description, long unix_time) {
        this.author_user_id = author_user_id;
        this.culprit_user_id = culprit_user_id;
        this.problem = problem;
        this.description = description;
        this.unix_time = unix_time;
    }

    public long getUnix_time() {
        return unix_time;
    }

    public int getAuthor_user_id() {
        return author_user_id;
    }

    public int getCulprit_user_id() {
        return culprit_user_id;
    }

    public String getDescription() {
        return description;
    }

    public String getProblem() {
        return problem;
    }
}