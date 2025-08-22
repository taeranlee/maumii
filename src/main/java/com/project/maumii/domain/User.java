package com.project.maumii.domain;

import com.project.maumii.domain.enums.Theme;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
public class User {
    @Id
    private String uId;

    @Column(nullable = false)
    private String uPwd;

    @Column(length = 100)
    private String uName;

    @Column(length = 20)
    private String uPhone;

    @Column(nullable = false, columnDefinition = "varchar(20) default 'cloud'") //DB 기본설정
    @Enumerated(EnumType.STRING)
    private Theme uTheme = Theme.cloud; //java 기본 설정

    private boolean uExposure;
}
