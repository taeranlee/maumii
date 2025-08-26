package com.project.maumii.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Entity
public class RecordList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rlId;

    @Column(length = 100)
    private String rlName;
}
