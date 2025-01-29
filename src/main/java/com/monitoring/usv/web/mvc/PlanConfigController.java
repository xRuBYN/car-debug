package com.monitoring.usv.web.mvc;

import com.monitoring.usv.domain.PlanConfig;
import com.monitoring.usv.repository.PlanConfigRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Controller
@RequestMapping("/api/mvc/plan-config")
public class PlanConfigController {

    private static final Logger log = LoggerFactory.getLogger(PlanConfigController.class);
    public static final String REDIRECT_API_MVC_PLAN_CONFIG_LIST = "redirect:/api/mvc/plan-config/list";

    private final PlanConfigRepository planConfigRepository;

    public PlanConfigController(PlanConfigRepository planConfigRepository) {
        this.planConfigRepository = planConfigRepository;
    }

    @GetMapping("/form")
    public String showForm(Model model) {
        log.info("showForm");
        model.addAttribute("planConfig", new PlanConfig());
        return "plan-config-form";
    }

    @PostMapping("/save")
    public String savePlanConfig(@ModelAttribute PlanConfig planConfig) {
        log.info("Save PlanConfig: {}", planConfig);
        if(planConfigRepository.existsByPlanType(planConfig.getPlanType())) {
            return REDIRECT_API_MVC_PLAN_CONFIG_LIST;
        } else {
            planConfigRepository.save(planConfig);
            return REDIRECT_API_MVC_PLAN_CONFIG_LIST;
        }
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable UUID id, Model model) {
        log.info("Show editForm for PlanConfig with id: {}", id);
        Optional<PlanConfig> planConfig = planConfigRepository.findById(id);
        if (planConfig.isPresent()) {
            model.addAttribute("planConfig", planConfig.get());
            return "plan-config-edit";
        } else {
            return REDIRECT_API_MVC_PLAN_CONFIG_LIST;
        }
    }

    @PostMapping("/update")
    public String updatePlanConfig(@ModelAttribute PlanConfig planConfig) {
        log.info("Update plan config PlanConfig with id: {}", planConfig);
        planConfigRepository.save(planConfig);
        return REDIRECT_API_MVC_PLAN_CONFIG_LIST;
    }

    @GetMapping("/list")
    public String showPlanConfigList(Model model) {
        List<PlanConfig> planConfigs = planConfigRepository.findAll();
        model.addAttribute("planConfigs", planConfigs);
        return "plan-config-list";
    }

    @GetMapping("/detail/{id}")
    public String deletePlanConfig(@PathVariable UUID id,  Model model) {
        Optional<PlanConfig> planConfig = planConfigRepository.findById(id);
        if (planConfig.isPresent()) {
            model.addAttribute("planConfig", planConfig.get());
            return "plan-config-detail";
        }
        return REDIRECT_API_MVC_PLAN_CONFIG_LIST;
    }
}
