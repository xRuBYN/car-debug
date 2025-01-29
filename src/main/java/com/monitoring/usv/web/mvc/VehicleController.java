package com.monitoring.usv.web.mvc;

import com.monitoring.usv.domain.Vehicle;
import com.monitoring.usv.domain.VehicleDetail;
import com.monitoring.usv.repository.VehicleDetailRepository;
import com.monitoring.usv.repository.VehicleRepository;
import com.monitoring.usv.service.dto.VehicleDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/api/mvc/vehicle")
public class VehicleController {
    private static final Logger log = LoggerFactory.getLogger(VehicleController.class);
    private final VehicleRepository vehicleRepository;
    private final VehicleDetailRepository vehicleDetailRepository;


    public VehicleController(VehicleRepository vehicleRepository, VehicleDetailRepository vehicleDetailRepository) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleDetailRepository = vehicleDetailRepository;
    }

    @GetMapping("/form")
    public String showVehicleForm(Model model) {
        log.info("Show vehicle form");
        model.addAttribute("vehicle", new VehicleDTO());
        return "vehicle-form";
    }

    @PostMapping("/save")
    public String saveVehicle(@ModelAttribute VehicleDTO vehicleDTO) {
        log.info("Save vehicle: {}", vehicleDTO);
        Vehicle vehicle = new Vehicle(vehicleDTO);
        vehicleRepository.save(vehicle);
        vehicleDetailRepository.save(new VehicleDetail(vehicleDTO, vehicle));
        return "redirect:/api/mvc/vehicle/list";
    }

    @GetMapping("/list")
    public String showPlanConfigList(Model model) {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        model.addAttribute("vehicles", vehicles);
        return "vehicle-list";
    }

    @GetMapping("/detail/{id}")
    public String showVehicleDetail(@PathVariable Long id, Model model) {
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if(vehicle.isPresent()) {
            model.addAttribute("vehicle", new VehicleDTO(vehicle.get()));
            return "vehicle-detail";
        }
        return "redirect:/vehicle/list"; // Redirect if not found
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        log.info("Show editForm for Vehicle with id: {}", id);
        Optional<Vehicle> vehicle = vehicleRepository.findById(id);
        if (vehicle.isPresent()) {
            model.addAttribute("vehicle", new VehicleDTO(vehicle.get()));
            return "vehicle-edit-form";
        } else {
            return "redirect:/api/mvc/vehicle/list";
        }
    }

    @PostMapping("/update")
    public String updateVehicle(@ModelAttribute VehicleDTO vehicleDTO) {
        log.info("Edit vehicle: {}", vehicleDTO);
        Optional<Vehicle> vehicle = vehicleRepository.findById(vehicleDTO.getId());
        if (vehicle.isPresent()) {
            Vehicle vehicleEntity = vehicle.get();
            vehicleEntity.setMake(vehicleDTO.getMake());
            vehicleEntity.setModel(vehicleDTO.getModel());
            vehicleEntity.setYear(vehicleDTO.getYear());
            vehicleEntity.getVehicleDetail().setColor(vehicleDTO.getColor());
            vehicleEntity.getVehicleDetail().setEngineDescription(vehicleDTO.getEngineDescription());
            vehicleEntity.getVehicleDetail().setFuelType(vehicleDTO.getFuelType());
            vehicleRepository.save(vehicleEntity);
        }
        return "redirect:/api/mvc/vehicle/list";
    }
}
