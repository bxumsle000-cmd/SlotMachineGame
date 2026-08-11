package com.poz.SlotMachine.service;

import com.poz.SlotMachine.constant.BetConfig;
import com.poz.SlotMachine.exception.ApiException;
import com.poz.SlotMachine.model.Members;
import com.poz.SlotMachine.repository.MemberWalletRepository;
import com.poz.SlotMachine.repository.MembersRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class RegisterService {
    private final MembersRepository membersRepository;
    private final MemberWalletRepository memberWalletRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterService(MembersRepository membersRepository, MemberWalletRepository memberWalletRepository,
                           PasswordEncoder passwordEncoder) {
        this.membersRepository = membersRepository;
        this.memberWalletRepository = memberWalletRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void registerNewUser(String username , String password){
        Optional<Members> userInfo = membersRepository.getUserInfoByName(username);
        if(userInfo.isPresent()){
            throw new ApiException(HttpStatus.CONFLICT, "帳號名稱已經註冊過了");
        }
        // 存進資料庫之前先雜湊，資料庫從此不再有明文密碼。
        // Repository 的 SQL 不用改，它只負責把字串塞進欄位，不在乎內容是明文還是雜湊。
        String hashedPassword = passwordEncoder.encode(password);
        membersRepository.registerNewUser(username , hashedPassword);
        Members registerUser = membersRepository.getUserInfoByName(username)
                .orElseThrow(()->new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "註冊失敗"));

        memberWalletRepository.createWallet(registerUser.id(),BetConfig.InitializeBalance);
    }
}
