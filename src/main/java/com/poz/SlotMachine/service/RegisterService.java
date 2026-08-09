package com.poz.SlotMachine.service;

import com.poz.SlotMachine.constant.BetConfig;
import com.poz.SlotMachine.exception.ApiException;
import com.poz.SlotMachine.model.Members;
import com.poz.SlotMachine.repository.MemberWalletRepository;
import com.poz.SlotMachine.repository.MembersRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class RegisterService {
    private final MembersRepository membersRepository;
    private final MemberWalletRepository memberWalletRepository;

    public RegisterService(MembersRepository membersRepository, MemberWalletRepository memberWalletRepository) {
        this.membersRepository = membersRepository;
        this.memberWalletRepository = memberWalletRepository;
    }

    @Transactional
    public void registerNewUser(String username , String password){
        Optional<Members> userInfo = membersRepository.getUserInfoByName(username);
        if(userInfo.isPresent()){
            throw new ApiException(HttpStatus.CONFLICT, "帳號名稱已經註冊過了");
        }
        membersRepository.registerNewUser(username ,password);
        Members registerUser = membersRepository.getUserInfoByName(username)
                .orElseThrow(()->new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "註冊失敗"));

        memberWalletRepository.createWallet(registerUser.id(),BetConfig.InitializeBalance);
    }
}
