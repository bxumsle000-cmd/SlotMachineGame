package com.poz.SlotMachine.service;

import com.poz.SlotMachine.model.Members;
import com.poz.SlotMachine.repository.MembersRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {
    private final MembersRepository membersRepository;

    public LoginService(MembersRepository membersRepository) {
        this.membersRepository = membersRepository;
    }

    public int checkUserID(String username,String password){
        Members userInfo = membersRepository.getUserInfo(username,password).orElseThrow(()-> new IllegalArgumentException("帳號或密碼錯誤"));
        if(userInfo.status()!=1){
            throw new IllegalStateException("帳號已經停用");
        }
        return userInfo.id();
    }
}
